<template>
  <v-app>
    <div :class="{waiting: isWaiting}">
      <h1>Concept: online version</h1>
      <div v-if="inGame">
        <game></game>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
  </v-app>
</template>

<script>
import Game from './Game'

export default {
  name: 'app',
  components: {
    Game
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
      this.$store.commit('joinGame')
    }
  }
}
</script>

<style>
  .waiting * {
    cursor: progress;
  }
</style>
