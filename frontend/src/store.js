import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash";
import {addToSubConcept, removeFromSubConcept} from "@/util/subconcept";
import {v4 as uuidv4} from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      reconnectError: false,
    },
    inGame: false,
    gameId: 'test',
    waitForStateId: undefined,
    concept: [],
    localConcept: [],
    needsSending: false
  },
  getters: {
    isWaiting: state => {
      return !!state.waitForStateId
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
      Vue.prototype.$socket.sendObj({
        message: 'sendmessage',
        data: {
          action: 'connectToGame',
          gameId: state.gameId
        }
      })
    },
    SOCKET_ONCLOSE (state)  {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error("Error", state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info("Reconnect", state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
    waitForStateId(state, stateId) {
      state.waitForStateId = stateId
    },
    setLocalConcept(state, concept) {
      state.localConcept = _.cloneDeep(concept)
      state.needsSending = true
    },
    newMessage(state, { data }) {
      if (data.action === 'newState') {
        state.inGame = true;
        if (state.waitForStateId === data.state.id) {
          state.waitForStateId = undefined
        }
        state.concept = data.state.concept
        state.localConcept = _.cloneDeep(state.concept)
      }
    },
    joinGame() {
      this.state.inGame = true;
    }
  },
  actions: {
    update({ commit, state, dispatch }, {newSubConcept, index}) {
      const newConcept = state.localConcept
      if (newSubConcept.length > 0) {
        newConcept[index] = newSubConcept
      } else {
        newConcept.splice(index, 1)
      }
      commit('setLocalConcept', newConcept)
      dispatch('send')
    },
    add({state, dispatch}, {key, index}) {
      const newSubConcept = addToSubConcept(state.localConcept[index] || [], key)
      dispatch('update', {newSubConcept, index})
    },
    remove({state, dispatch}, {key, index}) {
      const newSubConcept = removeFromSubConcept(state.localConcept[index] || [], key)
      dispatch('update', {newSubConcept, index})
    },
    send({ state, commit }) {
      // Avoid sending two messages through the websocket when dragging an icon from one sub-concept to another.
      Vue.nextTick(() => {
        if (state.needsSending) {
          const stateId = uuidv4()
          commit('waitForStateId', stateId)
          Vue.prototype.$socket.sendObj({
            message: 'sendmessage',
            data: {
              action: 'newState',
              gameId: state.gameId,
              state: {
                id: stateId,
                concept: state.localConcept.filter(subConcept => subConcept.length)
              }
            }
          })
        }
        state.needsSending = false
      })
    },
    newGame({commit, dispatch}) {
      commit('setLocalConcept', [])
      dispatch('send')
    }
  }
})
