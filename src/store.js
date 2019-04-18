import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      reconnectError: false,
    },
    inGame: false,
    gameId: undefined,
    gameUserName: undefined,
    requestedGameId: undefined,
    waitForStateId: undefined,
    concept: []
  },
  getters: {
    myGame: state => {
      return state.gameId && state.requestedGameId === state.gameId
    },
    isWaiting: state => {
      return !!state.waitForStateId
    }
  },
  mutations:{
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event)  {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
    requestGameId(state, gameId) {
      state.requestedGameId = gameId
    },
    waitForStateId(state, stateId) {
      state.waitForStateId = stateId
    },
    newMessage(state, { data }) {
      if (data.action === 'newGame') {
        state.gameId = data.gameId
        state.gameUserName = data.gameUserName
        state.concept = []
      }

      if (data.action === 'newConcept') {
        if (!state.gameId) {
          state.gameId = data.gameId
          state.gameUserName = data.gameUserName
        }

        if (state.waitForStateId === data.stateId) {
          state.waitForStateId = undefined
        }
        state.concept = data.concept
      }
    },
    joinGame(state, { userName }) {
      this.state.inGame = true;
      this.state.userName = userName;
    }
  }
})
