// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// element 配置
import 'element-ui/lib/theme-chalk/index.css'
import './util/elementComponent'
import {sendGET, sendPOST} from './axios/http'

Vue.config.productionTip = false
Vue.prototype.$post = sendPOST
Vue.prototype.$get = sendGET

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
