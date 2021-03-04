// Módulos principais
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueGlobalVar from 'vue-global-var'

// Configurações
import store from './store'
import router from './router/index'
import App from './App.vue'

// Banco de dados
import firebase from 'firebase';

// Network Requests
import axios from 'axios';

// Módulos de visualização
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/pt'
import ElementUI from 'element-ui';
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

// Variáveis de configuração/segredo
import { FIREBASE_KEYS } from './../settings'

// Charts
import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";


// register VueFusionCharts component
Vue.use(VueFusionCharts, FusionCharts, TimeSeries);


Vue.use(VueRouter)

Vue.use(Vuex)
Vue.use(Element, { locale })
Vue.use(ElementUI)

Vue.config.productionTip = false

// Initialize Firebase
firebase.initializeApp(FIREBASE_KEYS);
firebase.analytics();

// Check local storage to handle refreshes
if (window.localStorage) {
  var localUserString = window.localStorage.getItem('user') || 'null'
  var localUser = JSON.parse(localUserString)

  if (localUser && store.state.user !== localUser) {
    store.commit('SET_USER', localUser)
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
  }
}

let app = ''
// condition app start to firebase auth init
firebase.auth().onAuthStateChanged(user => {

  if (!app) {

    // setup axios to send firebase user token for backend validation
    axios.interceptors.request.use(async config => {
      var token = await firebase.auth().currentUser.getIdToken()
      config.headers.Authorization = `Bearer ${token}`;      
      return config
    }, (error) => {
      return Promise.reject(error)
    })

    // init vue app
    app = new Vue({
      router,
      store: store,
      render: h => h(App)
    }).$mount('#app');
  }
});

