import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
 Vue.config.productionTip = false;
import './assets/css/global.css'
import axios from 'axios'
// 配置请求的跟路径
// axios.defaults.baseURL=''
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // console.log(config)
  
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 使用$axios
Vue.prototype.$axios = axios

import echarts from 'echarts';
Vue.prototype.echarts = echarts;


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
