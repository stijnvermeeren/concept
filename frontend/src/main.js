import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify/lib'
import VueNativeSock from 'vue-native-websocket'
import App from './App.vue'
import store from './store'

Vue.use(Vuex)

Vue.use(Vuetify)

Vue.use(
  VueNativeSock,
  process.env.VUE_APP_WEBSOCKET_URL,
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
  store,
  vuetify: new Vuetify()
}).$mount('#app')
