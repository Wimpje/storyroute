import { PoiService } from "~/services/poiService"
import * as myUtils from "~/plugins/utils";


export const state = () => {
  return {
    pois: [],
    tags: [],
    lastUpdate: new Date(1945, 3, 11),
    currentPoi: null
  }
}
export const getters = {
  currentPoi(state) {
    return state.currentPoi
  },
  getPois(state) {
    return state.pois
  },
  poisLastUpdate(state) {
    return state.lastUpdate
  }
}

export const actions = {
  async getPois({ commit }) {
    const service = new PoiService()
    const docs = await service.getPois()
    commit("setPois", docs)
  },
  async updatePois({ commit }) {
    const service = new PoiService()
    const docs = await service.getPois(true)
    docs.forEach(poi => poi.selected = false)
    commit("setPois", docs)
  }
}

export const mutations = {
  createPoi(state, poi) {
    const newPoi = Object.assign({}, Schema, PoiSchema, poi)
    console.log('created poi', newPoi)
    state.pois.push(newPoi)
  },
  removeCurrentPoi(state) {
    if (state.currentPoi === null) { return }
    state.pois = state.pois.filter(p => p.id !== state.currentPoi.id)
    state.currentPoi = null
  },
  setCurrentPoi(state, poi) {
    state.currentPoi = poi
  },
  setPois(state, pois) {
    state.pois = pois
    state.pois.forEach(doc => {
      if(!doc.updatedDate) return 0
      if(doc.updatedDate > state.lastUpdate) {
        state.lastUpdate = doc.updatedDate
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
