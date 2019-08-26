<template>
  <div>
    <p v-if="$store.state.socket.isConnected" class="connected">Connected</p>
    <p v-else class="disconnected">Disconnected</p>

    <p><v-btn @click="newGame()">Start a new game</v-btn> (you'll be defining the concept)</p>

    <div v-if="$store.state.gameId">
      <h2>Selected concept</h2>
      <div v-if="!myGame">Player <em>{{$store.state.gameUserName}}</em> is in control.</div>
      <div v-if="! $store.state.concept.length">
        <div v-if="myGame">Start defining your concept below...</div>
        <div v-else>Wait for <em>{{$store.state.gameUserName}}</em> to define a concept...</div>
      </div>
      <div v-else>
        <div v-for="(subConcept, index) in $store.state.concept">
          <sub-concept :iconKeys="subConcept" :index="index" @add="add($event, index)" @remove="remove($event, index)" />
        </div>
      </div>

      <div v-if="myGame">
        <h2>Add icons to your concept</h2>
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
      timer: undefined,
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
          action: 'newConcept',
          gameId: this.$store.state.gameId,
          gameUserName: this.$store.state.gameUserName,
          stateId: stateId,
          concept: this.concept
        }
      })
    },
    newGame() {
      const gameId = uuidv4()
      this.$store.commit('requestGameId', gameId)
      this.$socket.sendObj({
        message: 'sendMessage',
        data: {
          action: 'newGame',
          gameId: gameId,
          gameUserName: this.$store.state.userName,
        }
      })
    }
  },
  created() {
    this.timer = setInterval(() => {
      if (this.myGame) {
        this.$socket.sendObj({
          message: 'sendMessage',
          data: {
            action: 'newConcept',
            gameId: this.$store.state.gameId,
            gameUserName: this.$store.state.gameUserName,
            stateId: this.$store.state.waitForStateId,
            concept: this.concept
          }
        })
      }
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
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