import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    boatAddress: process.env.NODE_ENV !== 'production' ? `http://192.168.73.173:8000` :  `${window.location.protocol}//${window.location.host}`,

    // settings d
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    BoatAddress: state => {
      return state.boatAddress;
    },
  }
})
