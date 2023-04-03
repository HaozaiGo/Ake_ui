import Vue from 'vue'
import App from './App.vue'
import componentsList from '../plugins/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index'
Vue.config.productionTip = false


Vue.use(componentsList)
Vue.use(ElementUI);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
