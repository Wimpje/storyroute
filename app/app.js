import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import store from './store/index.js'
import Home from './pages/Home'
import App from './pages/App'
import { isIOS } from "tns-core-modules/platform"
import { Frame } from '@nativescript/core/ui/frame';

import { localize } from "nativescript-localize";

import { MapView } from "nativescript-google-maps-sdk";
import VueDevtools from 'nativescript-vue-devtools'

import DrawerContent from "./components/DrawerContent";
import AppActionBar from "./components/AppActionBar";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

import RadListView from 'nativescript-ui-listview/vue';

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView);
Vue.use(RadSideDrawer);

Vue.registerElement('MapView', () => MapView)
Vue.component('AppActionBar', AppActionBar)

console.log("App start - will load firebase stuff now!")
const firebase = require("nativescript-plugin-firebase");
const fbInit = firebase.init({
    iOSEmulatorFlush: true,
    onAuthStateChanged: data => {
      console.log("auth state changed: ", data)
      store.dispatch('setUser', data)
    }
  })

if (isIOS) {
  GMSServices.provideAPIKey("<keyhere>");
}

Vue.filter("L", localize);

Vue.use(Vuex);

Vue.prototype.$store = store;

const vueApp = new Vue({
  store,
  render(h) {
    return h(
      App,
      [
        h(DrawerContent, { slot: 'drawerContent' }),
        h(Home, { slot: 'mainContent' })
      ]
    )
  },
  created() {
    // load the FB stuff when Vue is done creating itself (?needed)
    fbInit.then((resp) => {
      console.log("Firebase initialized", resp)
      firebase.login(
        {
          type: firebase.LoginType.ANONYMOUS
        })
        .then(user => {
          this.$store.dispatch("getPois")
          console.log('getPois called after logging in')
          this.$store.dispatch("initRoutes")
          console.log('initRoutes called after logging in')
          console.log("User uid: " + user.uid)
          
        })
        .catch(error => {
          // TODO handle errors on connections
          console.log("Issue with logging in: " + error);
        });  
    })
    .catch(error => console.log("Error initializing Firebase: " + error));
  }
})

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

vueApp.$start();
