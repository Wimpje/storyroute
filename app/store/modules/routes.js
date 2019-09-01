import { RouteService } from "~/services/routeService"


export const state = () => {
  return {
    routes: [],
    currentRoute: null
  }
}
export const getters = {
  currentRoute(state) {
    return state.currentRoute
  },
  getRoutes(state) {
    return state.routes
  }
}

export const actions = {
  async initRoutes({ commit }) {
    const service = new RouteService()
    const docs = await service.getRoutes()
    commit("setRoutes", docs)
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
