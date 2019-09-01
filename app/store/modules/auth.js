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
  },
  // eslint-disable-next-line object-shorthand
  googleSignIn: async function ({ commit }) {
    const result = await this.$app.$firebase.auth().signInWithPopup(new this.$app.$firebase.auth.GoogleAuthProvider())
    try {
      const user = createUserFromGoogleResponse(result)
      const token = result.credential.accessToken
      commit('setUser', user)

    } catch (error) {
      commit('setMessage', { title: 'Error', message: error.message, duration: 15000 }, { root: true })
    }
  },
  // eslint-disable-next-line object-shorthand
  googleSignOut: async function ({ commit }, payload) {

    try {
      await this.$app.$firebase.auth().signOut()
      // Removes user from Store
      commit('clearUser')

      console.log('Logout Successful')
    } catch (error) {
      console.log('Logout error', error)
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
