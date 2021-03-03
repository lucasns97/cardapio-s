import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    USER(state) {
      return state.user;
    },
    TOKEN(state) {
      return state.token;
    }
  },
  mutations: {
    TOGGLE_LOADING(state) {
      state.callingAPI = !state.callingAPI
    },
    TOGGLE_SEARCHING(state) {
      state.searching = (state.searching === '') ? 'loading' : ''
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
  },
  modules: {
  }
})
