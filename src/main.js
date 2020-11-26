import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

 Vue.config.productionTip = false;

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 使用$axios
Vue.prototype.$axios = axios

// 引入element ui 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
