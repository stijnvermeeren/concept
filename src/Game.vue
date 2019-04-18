<template>
  <div>
    <p v-if="$store.state.socket.isConnected" class="connected">Connected</p>
    <p v-else class="disconnected">Disconnected</p>

    <p><button @click="newGame()">Start a new game</button> (you'll be defining the concept)</p>

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
        <div>Filter: <input type="text" v-model="query" /></div>
        <div class="iconRow">
          <div v-for="key in filteredConceptIds" :key="key" class="icon">
            <icon
              :labels="concepts[key]"
              @click.prevent.stop="clickIcon($event, key)"
            />
          </div>
        </div>

        <vue-simple-context-menu
          elementId="vueSimpleContextMenu"
          :options="contextOptions"
          ref="vueSimpleContextMenu"
          @option-clicked="optionClicked">
        </vue-simple-context-menu>
      </div>
    </div>
  </div>
</template>

<script>
import concepts from './game.js'
import VueSimpleContextMenu from 'vue-simple-context-menu'
const uuidv4 = require('uuid/v4');

import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'
import Icon from './Icon.vue'
import SubConcept from './SubConcept'

export default {
  name: 'game',
  components: {
    SubConcept,
    VueSimpleContextMenu,
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
    clickIcon(event, key) {
      this.$refs.vueSimpleContextMenu.showMenu(event, key)
    },
    optionClicked(data) {
      this.addFromQuery(data.item, data.option.index)
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
    vertical-align: top;
  }
</style>
