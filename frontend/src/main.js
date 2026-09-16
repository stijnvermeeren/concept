import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueNativeSock from 'vue-native-websocket-vue3'
import App from './App.vue'
import store from './store'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ components, directives })

const app = createApp(App)
app.use(store)
app.use(vuetify)
app.use(VueNativeSock, import.meta.env.VUE_APP_WEBSOCKET_URL, {
  store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000
})
app.mount('#app')
