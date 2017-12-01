import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    track: null,
    explorerZoom: '14'
  },
  mutations: {
    setTrack (state, payload) {
      state.track = payload
    },
    setExplorerZoom (state, payload) {
      state.explorerZoom = payload
    }
  },
  actions: {
    setTrack ({ commit }, payload) {
      commit('setTrack', payload)
    },
    setExplorerZoom ({ commit }, payload) {
      commit('setExplorerZoom', payload)
    }
  },
  getters: {
    track (state) {
      return state.track
    },
    explorerZoom (state) {
      return state.explorerZoom
    }
  }
})
