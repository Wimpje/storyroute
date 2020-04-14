


export const state = () => ({
  orientation: '',
  iconMap: {
    stolperstein: "starofdavid",
    winkel: "shop",
    vliegtuig: "plane",
    start: "start",
    cafe: "coffee",
    restaurant: "restaurant"
  }
})


const getters = {
  screenOrientation(state) {
    return state.orientation
  },
  iconMap(state) {
    return state.iconMap
  }
};


// mutations
export const mutations = {
  setOrientation(state, value) {
    state.orientation = value
  }
}

export default {
  state,
  getters,
  mutations
}
