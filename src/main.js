import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/utils/directive'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css' //重置css基础样式
import '@/assets/css/common.css' //自定义公共样式
import * as $const from './utils/constant'
import * as filters from './utils/filters'
import './assets/icon/iconfont/iconfont.css'
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
Vue.config.productionTip = false
Vue.prototype.$const = $const
Vue.prototype.filters = filters
Vue.config.devtools = true
Object.keys(filters).forEach(key => {
  //注册自定义的过滤器
  Vue.filter(key, filters[key])
})
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
