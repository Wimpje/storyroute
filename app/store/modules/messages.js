import { Toasty } from 'nativescript-toasty';
// this is silly but whatevs

const TIMEOUT = 5000
export const state = () => ({
  text: '',
  duration: TIMEOUT
})

// mutations
export const mutations = {
  setMessage (state, payload) {
    if (payload.text) 
      state.text = payload.text 
    else
      state.text = ''

    state.duration = payload.duration || TIMEOUT  

    new Toasty({ text: state.text  })
    .setToastDuration(ToastDuration.LONG)
    .setToastPosition(ToastPosition.BOTTOM)
    .setTextColor(new Color('white'))
    .setBackgroundColor('#ff9999')
    .show();

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
