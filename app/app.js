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
import CachedImage from '~/components/CachedImage'
import CenterLabel from '~/components/CenterLabel'

import RadSideDrawer from "nativescript-ui-sidedrawer/vue";

import RadListView from 'nativescript-ui-listview/vue';
import { android, AndroidApplication, AndroidActivityBundleEventData } from "tns-core-modules/application";
import * as utils from "~/plugins/utils";
import { AudioService } from "~/services/audioService"
import * as application from "tns-core-modules/application";
import { ToastService } from '~/services/toastService'
import { allowSleepAgain } from "nativescript-insomnia";
import { getBoolean, setBoolean, setString, hasKey } from "tns-core-modules/application-settings";

// Set up config if not there:

const setupConfigBool = (key, value) => {
  if (!hasKey(key)) {
    console.log(`creating key ${key}, and setting it to ${value}`)
    setBoolean(key, value)
  }
}

const setupConfigString = (key, value) => {
  if (!hasKey(key)) {
    console.log(`creating key ${key}, and setting it to ${value}`)
    setString(key, value)
  }
}

setupConfigBool('googleAnalytics', true)
setupConfigBool('googleCrashlytics', true)
setupConfigString('theme', 'default')

Vue.prototype.$player = new AudioService()
Vue.prototype.$store = store
Vue.prototype.$toast = new ToastService()

application.on(application.launchEvent, (args) => {
  // appSettings.setNumber("start", 0);
  // init settings or something?
});

application.on(application.suspendEvent, (args) => {
  Vue.prototype.$player.pause()
  Vue.prototype.$toast.cancel();
  allowSleepAgain().then(function () {
    console.log("suspendEvent: Insomnia is inactive, good night!");
  })
});

application.on(application.exitEvent, (args) => {
  Vue.prototype.$player.pause();
  Vue.prototype.$player.dispose();
  Vue.prototype.$toast.cancel();
  allowSleepAgain().then(function () {
    console.log("exitEvent Insomnia is inactive, good night!");
  })
});

let lastPress
let timeDelay = 500 // ms
if (android) {
  android.on(AndroidApplication.activityBackPressedEvent, function (args) {
    console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    if (lastPress + timeDelay > Date.now()) {
      // double tap kill
      console.log('bybye')
      android.foregroundActivity.finish();
    }
    else {
      // navigate back if relevant
      args.cancel = true
      utils.navigateBackFromButton(args)
    }
    lastPress = Date.now()
  });
}

Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView);
Vue.use(RadSideDrawer);

Vue.registerElement('MapView', () => MapView)

// some of our own custom components
Vue.component('AppActionBar', AppActionBar)
Vue.component('CenterLabel', CenterLabel)
Vue.component('CachedImage', CachedImage)

console.log("App start - will load firebase stuff now!")
const firebase = require("nativescript-plugin-firebase");
const fbInit = firebase.init({
  iOSEmulatorFlush: true,
  analyticsCollectionEnabled: getBoolean('googleAnalytics'), // enabled
  crashlyticsCollectionEnabled: getBoolean('googleCrashlytics'), // enabled
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
      console.log("Firebase initialized")
      firebase.login(
        {
          type: firebase.LoginType.ANONYMOUS
        })
        .then(user => {
          this.$store.dispatch("getPois")
          console.log('getPois called after logging in')
          this.$store.dispatch("initRoutes")
          console.log('initRoutes called after logging in')
          console.log(`user.uid: ${user.uid}`)

        })
        .catch(error => {
          // TODO handle errors on connections
          firebase.crashlytics.log("issue with logging in: " + error)
          console.log("Issue with logging in: " + error);
        });
    })
      .catch(error => {
        console.log("Error initializing Firebase: " + error)
        firebase.crashlytics.log("Error initializing Firebase: " + error)

      } );
  }
})

Vue.showMyModal = function (component, options) {
  return new Promise((resolve) => {

    let resolved = false
    const closeCb = function (data) {
      if (resolved) return
      resolved = true
      resolve(data)
      modalPage.closeModal()
      modalInstance.$destroy()
    }

    const opts = Object.assign({}, options, {
      context: null,
      closeCallback: closeCb
    })

    const modalInstance = new Vue({
      name: 'ModalEntry',
      methods: {
        closeCb: closeCb
      },
      render: function (h) {
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
