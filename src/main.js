import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.config.productionTip = false

// 配置elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


// 在全局配置axios
// axios.defaults.baseURL = 'https://www.escook.cn'
/* 
  跨域的解决：
    1. 在baseURL使用本地要用的地址。如：http://localhost:3000
    2. 在DevServer的proxy中配置target为要发送请求的路径。如：https://www.escook.cn
*/
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$http = axios // 在每个vc身上都可以访问到

// 声明请求拦截器
let loadingInstance = null;
axios.interceptors.request.use(
  // 成功的回调函数
  (config) => {
    // 展示loading效果(关键写法) --- fullscreen 是否全屏
    loadingInstance = ElementUI.Loading.service({ fullscreen: true })
    return config; // 这一步必须做，不能省
  },
  // 失败的回调函数 --- 可以被省略
  // () => { },
)
// 声明响应拦截器
axios.interceptors.response.use(
  // 成功的回调函数
  (response) => {
    // 隐藏loading效果
    loadingInstance.close();
    return response;
  },
  // 失败的回调函数 --- 可以被省略
  // () => { },
)


Vue.filter('dataFormat', (dtStr) => {
  // 第一个参数：dtStr是管道符右边的值
  const dt = new Date(dtStr);
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  let hh = dt.getHours();
  let mm = dt.getMinutes();
  let ss = dt.getSeconds();
  hh = hh >= 10 ? hh : '0' + hh;
  mm = mm >= 10 ? hh : '0' + mm;
  ss = ss >= 10 ? hh : '0' + ss;
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
