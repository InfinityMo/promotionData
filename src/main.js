import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/theme/index.css'
import '@/common/styles/reset.less'
import '@/common/styles/common.less'
import '@/common/styles/el-reset.less'
import '@/common/styles/icon-set.less'
import '@/common/utils/permission'
import axios from './common/network/request'
import debounce from '@/common/utils/debounce'
// 挂载请求
Vue.prototype.$request = axios
// 挂载防抖函数
Vue.prototype.$debounce = debounce
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
