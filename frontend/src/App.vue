<template>
  <v-app>
    <v-main app>
      <all-icons-panel :concept="$store.state.concept" />
      <v-container>
        <div :class="{waiting: isWaiting}">
          <v-btn @click="$store.dispatch('newGame')" class="float-right">Reset (start a new game)</v-btn>
          <h1>Concept: online version</h1>
          <div v-if="inGame">
            <game></game>
          </div>
          <div v-else>
            Loading...
          </div>
        </div>
      </v-container>
    </v-main>
    <v-footer app>
      <v-row justify="center" no-gutters>
        <div v-if="$store.state.socket.isConnected" class="connected">Connected</div>
        <div v-else class="disconnected">Disconnected</div>
        <div class="ml-6">
          Source code and more information on <a href="https://github.com/stijnvermeeren/concept">Github</a>.
        </div>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Game from './Game'
import AllIconsPanel from "@/AllIconsPanel";

export default {
  name: 'app',
  components: {
    Game,
    AllIconsPanel
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

  .connected {
    color: darkgreen;
  }
  .disconnected {
    color: darkred;
  }
</style>
