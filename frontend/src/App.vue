<template>
  <v-app :class="{waiting: isWaiting}">
    <v-main app>
      <all-icons-panel />
      <v-container>
        <h1>Concept: online version</h1>
        <template v-if="gameId">
          <v-card flat>
            <v-card-text>
              Invite others to this game with this URL:
              <v-chip @click="copyUrl" label><v-icon left>mdi-content-copy</v-icon> {{url}}</v-chip>
            </v-card-text>
          </v-card>
          <div v-if="isInitialised">
            <game></game>
            <div class="mt-6">
              <v-btn @click="$store.dispatch('newGame')">Reset (start a new game)</v-btn>
            </div>
          </div>
          <div v-else>
            Loading game...
          </div>
        </template>
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
import {v4 as uuidv4} from "uuid";

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
    isInitialised() {
      return !this.$store.state.initialising;
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
  },
  created() {
    if (!window.location.search.substring(1)) {
      const gameId = uuidv4()
      const url = `${window.location.origin}${window.location.pathname}?${gameId}`
      window.location.replace(url)
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
