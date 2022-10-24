
Vue.showMyModal = function(component, options) {
  return new Promise((resolve) => {
    
    let resolved = false
    const closeCb = function(data) {
      if (resolved) return
      resolved = true
      resolve(data)
      modalPage.closeModal()
      modalInstance.$destroy()
    }

    const opts = Object.assign({}, options,  {
      context: null,
      closeCallback: closeCb
    })

    const modalInstance = new Vue({
      name: 'ModalEntry',
      methods: {
        closeCb: closeCb
      },
      render: function(h) {
        return h(component, {
          props: opts.props
        })
      }
    })
    const modalPage = modalInstance.$mount().$el.nativeView
    Frame.topmost().showModal(modalPage, opts)


  })
}
