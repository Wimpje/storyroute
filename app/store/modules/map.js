//import { fireStore } from 'firebase'

export const state = () => {
  return {
    center:  { lat: 52.5248059, lng: 6.426292600000011 },
    zoom: 12,
    ref: null,
    showAutocomplete: false,
    pois: [],
    configs: {}
  }
}
export const getters = {
  mapCenter (state) {
    return state.center
  },
  mapZoom (state) {
    return state.zoom
  },
  mapShowAutocomplete (state) {
    return state.showAutocomplete
  },
  getMapConfigs(state) {
    return state.configs
  }
}

export const mutations = {
  setMapZoom (state, zoom) {
    state.zoom = zoom
  },
  setMapCenter (state, val) {
    state.center = val
  },
  setMapShowAutocomplete (state, val) {
    state.showAutocomplete = val
  },
  setMapConfig(state, val) {
    if (val.id && val.config)
      state.configs[val.id] = val.config
    else 
      console.warn('weird value received for mapconfig')
  }
}
export default {
  state,
  getters,
  mutations
}
