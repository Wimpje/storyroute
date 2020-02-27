import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import store from './store/index.js'
import routes from "./router";
import { isIOS } from "tns-core-modules/platform"
import { localize } from "nativescript-localize";
import firebase from "nativescript-plugin-firebase";
import { MapView } from "nativescript-google-maps-sdk";
import VueDevtools from 'nativescript-vue-devtools'

import DrawerContent from "./components/DrawerContent";
import AppActionBar from "./components/AppActionBar";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

Vue.use(RadSideDrawer);

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
Vue.registerElement('MapView', () => MapView)
Vue.component('AppActionBar', AppActionBar)


// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

firebase
  .init({
    iOSEmulatorFlush: true,
    onAuthStateChanged: data => {
      console.log("auth state changed: ", data)
      store.dispatch('setUser', data)
    }
  })
  .then(() => console.log("Firebase initialized"))
  .catch(error => console.log("Error initializing Firebase: " + error));

if (isIOS) {
  GMSServices.provideAPIKey("<KEYHERE>");
}

firebase.login(
  {
    type: firebase.LoginType.ANONYMOUS
  })
  .then(user => {
    store.dispatch("getPois")
    console.log('getPois called from app start')
    store.dispatch("initRoutes")
    console.log('initRoutes called from app start')
    console.log("User uid: " + user.uid)
  })
  .catch(error => {
    // TODO handle errors on connections
    console.log("Issue with logging in: " + error);
  });

Vue.filter("L", localize);
Vue.use(Vuex);

Vue.prototype.$store = store;

new Vue({
  store,
  render(h) {
    return h(
      routes.app/*,
      [
        h(DrawerContent, { slot: 'drawerContent' }),
        h(routes.home, { slot: 'mainContent' })
      ]*/
    )
  }
}).$start();
