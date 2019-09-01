//import { fireStore } from 'firebase'

export const state = () => {
  return {
    center:  { lat: 52.5248059, lng: 6.426292600000011 },
    zoom: 12,
    currentRoute: null,
    ref: null,
    showAutocomplete: false,
    pois: []
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
  }
}
export default {
  state,
  getters,
  mutations
}
