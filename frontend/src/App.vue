<template>
  <v-app>
    <v-main app>
      <all-icons-panel :concept="$store.state.concept" />
      <v-container :class="{waiting: isWaiting}">
        <h1>Concept: online version</h1>
        <div v-if="gameId">
          <div>
            Invite others to this game with this URL:
            <v-chip @click="copyUrl" label><v-icon left>mdi-content-copy</v-icon> {{url}}</v-chip>
          </div>
          <game></game>
          <v-btn @click="$store.dispatch('newGame')">Reset (start a new game)</v-btn>
        </div>
        <div v-else>
          Loading...
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
    isWaiting() {
      return this.$store.getters.isWaiting;
    },
    url() {
      return window.location.href;
    },
    gameId() {
      return this.$store.state.gameId;
    }
  },
  methods: {
    copyUrl() {
      navigator.clipboard.writeText(this.url)
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
