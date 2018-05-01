import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    track: null,
    explorerZoom: '14',
    firstTiles: null,
    secondTiles: null
  },
  mutations: {
    setTrack (state, payload) {
      state.track = payload
    },
    setExplorerZoom (state, payload) {
      state.explorerZoom = payload
    },
    setFirstTiles (state, payload) {
      state.firstTiles = payload
    },
    setSecondTiles (state, payload) {
      state.secondTiles = payload
    }
  },
  actions: {
    setTrack ({ commit }, payload) {
      commit('setTrack', payload)
    },
    setExplorerZoom ({ commit }, payload) {
      commit('setExplorerZoom', payload)
    },
    setFirstTiles ({ commit }, payload) {
      commit('setFirstTiles', payload)
    },
    setSecondTiles ({ commit }, payload) {
      commit('setSecondTiles', payload)
    }
  },
  getters: {
    track (state) {
      return state.track
    },
    explorerZoom (state) {
      return state.explorerZoom
    },
    firstTiles (state) {
      return state.firstTiles
    },
    secondTiles (state) {
      return state.secondTiles
    }
  }
})
