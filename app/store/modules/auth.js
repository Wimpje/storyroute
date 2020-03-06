/* eslint-disable no-console */

export const state = () => ({
  user: null
})

const getters = {

};

// mutations
export const mutations = {
  setUser(state, data) {
    state.user = data
  },
  setUserFromGoogleResponse(state, data) {
    state.user = createUserFromGoogleResponse(data)
  },
  clearUser(state) {
    state.user = null
  }
}

export const actions = {
  // eslint-disable-next-line object-shorthand
  setUser: function ({ commit }, result) {
    let data = {};
    try {
      data = createUserFromGoogleResponse(result)
      commit('setUser', data)
    } catch (err) {
      commit('clearUser')
      commit('setMessage', { title: 'Error', message: err, duration: 15000 }, { root: true })
    }
  }
}

const createUserFromGoogleResponse = (result) => {
  if (!result) { return null }
  const user = result.user ? result.user : result
  return user.uid
  // return { name: user.displayName, email: user.email, avatar: user.photoURL }
}


export default {
  state,
  getters,
  actions,
  mutations
}
