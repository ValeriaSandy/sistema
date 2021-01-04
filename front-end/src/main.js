import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.use(VueAxios, axios,VueTextareaAutosize )
Vue.config.productionTip = false
axios.defaults.baseURL='http://localhost:3000/api/'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
