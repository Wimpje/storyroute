import { RouteService } from "~/services/routeService"
import * as myUtils from "~/plugins/utils";

export const state = () => {
  return {
    routes: [],
    lastUpdate: new Date(1945, 3, 11),
    currentRoute: null,
  }
}
export const getters = {
  currentRoute(state) {
    return state.currentRoute
  },
  getRoutes(state) {
    return state.routes
  },
  getRoutesStartPois(state) {
    return state.routes.map(route => route.pois[0])
  },
  routesLastUpdate(state) {
    return state.lastUpdate
  }
}

export const actions = {
  async initRoutes({ commit }) {
    const service = new RouteService()
    const docs = await service.getRoutes()
    commit("setRoutes", docs.filter(d => d.visible))
  }
}

export const mutations = {
  setCurrentRoute(state, val) {
    // validate route
    console.log('setCurrentRoute', val)
    state.currentRoute = val
  },
  setRoutes(state, routes) {
    state.routes = routes
    
    state.routes.forEach(doc => {
      if(!doc.updatedDate) return 0
      if(doc.updatedDate > state.lastUpdate) {
        state.lastUpdate = doc.updatedDate
      }
    })
  },
  setCurrentRouteToNone(state) {
    state.currentRoute = null
  },
  removeCurrentRoute(state, payload) {
    if (state.currentRoute === null) { return }
    state.routes = state.routes.filter(r => r.id !== state.currentRoute.id)
    state.currentRoute = null
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
