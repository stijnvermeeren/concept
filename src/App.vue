<template>
  <div :class="{waiting: isWaiting}">
    <h1>Concept: online version</h1>
    <div v-if="inGame">
      <game></game>
    </div>
    <div v-else>
      <div class="userName">
        <input v-model="userName" placeholder="Enter your name" />
      </div>
      <div v-if="$store.state.gameId" class="joinGame">
        <button @click="joinGame()" :disabled="!userName">Join game</button>
      </div>
      <div v-else-if="canStartNewGame" class="joinGame">
        <button @click="joinGame()" :disabled="!userName">Start a new game</button>
      </div>
      <div v-else class="searchingForActiveGame">
        Please wait while looking for active games...
      </div>
    </div>
  </div>
</template>

<script>
import Game from './Game'

export default {
  name: 'app',
  components: {
    Game
  },
  data() {
    return {
      timer: undefined,
      userName: '',
      canStartNewGame: false
    }
  },
  computed: {
    inGame() {
      return this.$store.state.inGame
    },
    isWaiting() {
      return this.$store.getters.isWaiting;
    }
  },
  methods: {
    joinGame() {
      this.$store.commit('joinGame', { userName: this.userName })
    }
  },
  created() {
    this.timer = setTimeout(() => {
      if (!this.$store.state.gameId) {
        this.canStartNewGame = true;
      }
    }, 7000)
  }
}
</script>

<style>
  .waiting * {
    cursor: progress;
  }

  div.userName {
    margin: 1em 2em;
  }
  div.joinGame {
    margin: 1em 2em;
  }
  div.searchingForActiveGame {
    margin: 1em 2em;
    font-style: italic;
  }
</style>
