<template>
  <div>
    <p v-if="$store.state.socket.isConnected" class="connected">Connected</p>
    <p v-else class="disconnected">Disconnected</p>

    <p><v-btn @click="newGame()">Reset (start a new game)</v-btn></p>

    <div>
      <h2>Selected concept</h2>
      <div>
        <div v-if="!$store.state.concept.length">No concept defined.</div>
        <div v-for="(subConcept, index) in $store.state.concept">
          <sub-concept :iconKeys="subConcept" :index="index" @add="add($event, index)" @remove="remove($event, index)" />
        </div>
      </div>

      <div>
        <h2>Add icons to the concept</h2>
        <div>
          <v-text-field
            label="Filter concepts"
            placeholder="Query"
            filled
            v-model="query"
          />
        </div>
        <div class="iconRow">
          <div v-for="key in filteredConceptIds" :key="key" class="icon">
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  absolute
                  top
                  right
                  small
                  color="primary"
                  v-on="on"
                >
                  <v-icon>add_box</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="option in contextOptions" :key="option.index">
                  <v-list-item-title @click="addFromQuery(key, option.index)">
                    {{option.name}}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <icon
              :icon-key="key"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import concepts from './game.js'
const uuidv4 = require('uuid/v4');

import Icon from './Icon.vue'
import SubConcept from './SubConcept'

export default {
  name: 'game',
  components: {
    SubConcept,
    Icon
  },
  data() {
    return {
      concept: [],
      query: ''
    }
  },
  computed: {
    concepts() {
      return concepts
    },
    filteredConceptIds() {
      return Object.keys(concepts).filter(conceptId => {
        return !! concepts[conceptId].join('/').split('/').find(label => {
          return label.toLowerCase().startsWith(this.query.toLowerCase())
        })
      })
    },
    myGame() {
      return this.$store.getters.myGame
    },
    contextOptions() {
      if (this.concept.length === 0) {
        return [{ name: 'Define as main concept', index: 0 }]
      }

      const options = this.concept.map((concept, i) => {
        const name = this.subConceptName(i)
        const iconName = concepts[concept[0]][0]
        return { name: `Add to ${name} (${iconName})`, index: i }
      })

      options.push({ name: 'Define as new sub-concept', index: this.concept.length });
      return options
    }
  },
  methods: {
    subConceptName(index) {
      return index === 0 ? 'main concept' : `sub-concept ${index}`
    },
    ucFirst(value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    addFromQuery(key, index) {
      this.add(key, index)
      this.query = '';
    },
    add(key, index) {
      if (this.concept.length <= index) {
        this.concept.push([key])
      } else {
        this.concept[index].push(key)
      }

      this.send()
      this.query = '';
    },
    remove(key, index) {
      const iconIndex = this.concept[index].lastIndexOf(key)
      if (iconIndex > -1) {
        if (iconIndex === 0) {
          this.concept.splice(index, 1)
        } else {
          this.concept[index].splice(iconIndex, 1)
        }
        this.send()
      }
    },
    send() {
      const stateId = uuidv4()
      this.$store.commit('waitForStateId', stateId)
      this.$socket.sendObj({
        message: 'sendMessage',
        data: {
          action: 'newState',
          state: {
            id: stateId,
            concept: this.concept
          }
        }
      })
    },
    newGame() {
      this.concept = [];
      this.send();
    }
  }
}
</script>

<style scoped>
  .connected {
    color: darkgreen;
  }
  .disconnected {
    color: darkred;
  }

  .icon {
    display: inline-block;
    position: relative;
  }
</style>
