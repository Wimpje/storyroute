


export const state = () => ({
  orientation: '',
})


const getters = {
  screenOrientation(state) {
    return state.orientation
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
