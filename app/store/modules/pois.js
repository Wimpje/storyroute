import { PoiService } from "~/services/poiService"


export const state = () => {
  return {
    pois: [],
    tags: [],
    currentPoi: null
  }
}
export const getters = {
  currentPoi(state) {
    return state.currentPoi
  },
  getPois(state) {
    return state.pois
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
    console.log('setcurrent', poi)
    state.currentPoi = poi
  },
  setPois(state, pois) {
    state.pois = pois
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
