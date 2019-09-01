const TIMEOUT = 5000
export const state = () => ({
  message: '',
  title: '',
  duration: TIMEOUT
})

// mutations
export const mutations = {
  setMessage (state, payload) {
    if (payload.message) 
      state.message = payload.message 
    else
      state.message = ''

    if (payload.title) 
      state.title = payload.title 
    else
      state.title = ''

    state.duration = payload.duration || TIMEOUT
  },
  clearMessage (state) {
    state.title = ''
    state.message = ''
    state.duration = TIMEOUT
  }
}

export default {
  state,
  mutations
}
