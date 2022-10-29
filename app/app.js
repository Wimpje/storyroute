import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import VueDevtools from 'nativescript-vue-devtools'

import store from './store/index.js'
import Home from './pages/Home'
import App from './pages/App'
import { isIOS, screen } from "@nativescript/core/platform"
import { Frame, isAndroid } from '@nativescript/core/ui/frame';
import { localize } from "@nativescript/localize";
import { GoogleMaps } from "@kefah/nativescript-google-maps";
import DrawerContent from "./components/DrawerContent";
import AppActionBar from "./components/AppActionBar";
import CachedImage from '~/components/CachedImage'
import CenterLabel from '~/components/CenterLabel'
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import RadListView from 'nativescript-ui-listview/vue';
import {ApplicationSettings, Application, AndroidApplication } from '@nativescript/core';
import { android } from '@nativescript/core/application';

import { AudioService } from "~/services/audioService"
import { ToastService } from '~/services/toastService'
import { allowSleepAgain } from "@nativescript-community/insomnia";
import * as utils from "~/plugins/utils";

// UI-material components imports
import BottomNavigation from '@nativescript-community/ui-material-bottom-navigation/vue';
Vue.use(BottomNavigation);
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue';
Vue.use(TabsPlugin);
import ImageModule from '@nativescript-community/ui-image/vue';
import * as imageModule from '@nativescript-community/ui-image';
Vue.use(ImageModule);


Vue.registerElement('VideoPlayer', () => require('nativescript-videoplayer').Video)

// Set up config if not there:

const setupConfigBool = (key, value) => {
  if (!ApplicationSettings.hasKey(key)) {
    console.log(`Config: creating key ${key}, and setting  it to ${value}`)
    ApplicationSettings.setBoolean(key, value)
  }
}

const setupConfigString = (key, value) => {
  if (!ApplicationSettings.hasKey(key)) {
    console.log(`Config: creating key ${key}, and setting it to ${value}`)
    ApplicationSettings.setString(key, value)
  }
}

//setupConfigBool('googleAnalytics', true)
setupConfigBool('googleCrashlytics', true)
setupConfigBool('screenOnWithMap', true)
setupConfigBool('showDoubleClickHint', true)

setupConfigString('theme', 'default')

Vue.prototype.$player = new AudioService()
Vue.prototype.$store = store
Vue.prototype.$toast = new ToastService()


Application.on(Application.launchEvent, (args) => {
    // init settings or something?
    imageModule.initialize({ isDownsampleEnabled: true })
});

Application.on(Application.suspendEvent, (args) => {
  Vue.prototype.$player.pause()
  Vue.prototype.$toast.cancel();
});

// quick & dirty setting of initial orientation
const setCurrentOrientation = () => {
  let orientation = 'portrait'

  // detection of orientation does not work well atm ... 

  store.commit('setOrientation', orientation)
  console.log(`init orientation = ${orientation} width: ${screen.mainScreen.widthDIPs} height: ${screen.mainScreen.heightDIPs}`)
}

Application.on(Application.orientationChangedEvent, (args) => {
 console.log('rotated!', args.newValue)
 store.commit('setOrientation', args.newValue)
});

Application.on(Application.exitEvent, (args) => {
  Vue.prototype.$player.pause();
  Vue.prototype.$player.dispose();
  Vue.prototype.$toast.cancel();
  allowSleepAgain().then(function () {
    console.log("exitEvent: insomnia is inactive, good  night!");
  })
  imageModule.shutDown()
});

let lastPress
let timeDelay = 500 // ms
if (android) {
  android.on(AndroidApplication.activityBackPressedEvent, function (args) {
    if (lastPress + timeDelay > Date.now()) {
      // double tap kill
      console.log('bybye')
      android.foregroundActivity.finish();
    }
    else {
      // navigate back if relevant
      args.cancel = true
      Vue.prototype.$navigateBackFromButton(args)
    }
    lastPress = Date.now()
  });
}

Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

if (__DEV__) {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !(__DEV__)

Vue.use(RadListView);
Vue.use(RadSideDrawer);

Vue.registerElement('MapView', () => GoogleMaps)

// some of our own custom components
Vue.component('AppActionBar', AppActionBar)
Vue.component('CenterLabel', CenterLabel)
Vue.component('CachedImage', CachedImage)

if (isIOS) {
  GMSServices.provideAPIKey("<keyhere>");
}

Vue.filter("L", localize);

Vue.use(Vuex);


utils.initFirebase()

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
    // can only be run after application start
    setCurrentOrientation()

    // load the FB stuff when Vue is done creating itself (?needed)
    console.log('init FB from app.js, now loading data')
    utils.loadFirebaseData()
    
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
