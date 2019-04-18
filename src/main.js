import Vue from 'vue'
import Vuex from 'vuex'
import VueNativeSock from 'vue-native-websocket'
import App from './App.vue'
import store from './store'
import webSocketUrl from '../config'

Vue.use(Vuex)
Vue.use(
  VueNativeSock,
  webSocketUrl,
  {
    store: store,
    format: 'json',
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000),
  }
)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
