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
      Vue.prototype.$socket.sendObj({
        message: 'sendmessage',
        data: {
          action: 'getGameState'
        }
      })
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
      if (data.action === 'newState') {
        state.inGame = true;
        if (state.waitForStateId === data.state.id) {
          state.waitForStateId = undefined
        }
        state.concept = data.state.concept
      }
    },
    joinGame(state) {
      this.state.inGame = true;
    }
  }
})
