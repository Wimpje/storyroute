import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import store from './store/index.js'
import Home from './pages/Home'
import App from './pages/App'
import { isIOS, screen } from "tns-core-modules/platform"
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
import { android, AndroidApplication } from "tns-core-modules/application";
import { AudioService } from "~/services/audioService"
import * as application from "tns-core-modules/application";
import { ToastService } from '~/services/toastService'
import { allowSleepAgain } from "nativescript-insomnia";
import { getBoolean, setBoolean, setString, hasKey } from "tns-core-modules/application-settings";
import * as imageModule from 'nativescript-image';
import ImagePlugin from 'nativescript-image/vue';

const firebase = require("nativescript-plugin-firebase");
Vue.registerElement('VideoPlayer', () => require('nativescript-videoplayer').Video)

// Set up config if not there:

const setupConfigBool = (key, value) => {
  if (!hasKey(key)) {
    console.log(`Config: creating key ${key}, and setting  it to ${value}`)
    setBoolean(key, value)
  }
}

const setupConfigString = (key, value) => {
  if (!hasKey(key)) {
    console.log(`Config: creating key ${key}, and setting it to ${value}`)
    setString(key, value)
  }
}

setupConfigBool('googleAnalytics', true)
setupConfigBool('googleCrashlytics', true)
setupConfigBool('screenOnWithMap', true)
setupConfigString('theme', 'default')

Vue.prototype.$player = new AudioService()
Vue.prototype.$store = store
Vue.prototype.$toast = new ToastService()


application.on(application.launchEvent, (args) => {
    // init settings or something?
    imageModule.initialize({ isDownsampleEnabled: true })
});

application.on(application.suspendEvent, (args) => {
  Vue.prototype.$player.pause()
  Vue.prototype.$toast.cancel();
});

// quick & dirty setting of initial orientation
const setCurrentOrientation = () => {
  if(screen.mainScreen.widthDIPs > screen.mainScreen.heightDIPS) {
    store.commit('setOrientation', 'landscape')
  }
  else {
    store.commit('setOrientation', 'portrait')
  }
}
setCurrentOrientation()

application.on(application.orientationChangedEvent, (args) => {
 console.log('rotated!', args.newValue)
 store.commit('setOrientation', args.newValue)
});

application.on(application.exitEvent, (args) => {
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

if (TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.use(RadListView);
Vue.use(RadSideDrawer);
Vue.use(ImagePlugin);


Vue.registerElement('MapView', () => MapView)

// some of our own custom components
Vue.component('AppActionBar', AppActionBar)
Vue.component('CenterLabel', CenterLabel)
Vue.component('CachedImage', CachedImage)

console.log("App start - will load firebase stuff now!")
const fbInit = firebase.init({
  iOSEmulatorFlush: true,
  analyticsCollectionEnabled: getBoolean('googleAnalytics'), // enabled
  crashlyticsCollectionEnabled: getBoolean('googleCrashlytics'), // enabled
  onAuthStateChanged: data => {
    console.log("FB: auth state changed: ", data)
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
      console.log("FB: initialized")
      firebase.login(
        {
          type: firebase.LoginType.ANONYMOUS
        })
        .then(user => {
          this.$store.dispatch("getPois")
          console.log('FB: getPois called after logging in')
          this.$store.dispatch("initRoutes")
          console.log('FB: initRoutes called after logging in')
        })
        .catch(error => {
          // TODO handle errors on connections
          firebase.crashlytics.log("FB: issue with logging in: " + error)
          console.error("FB: issue with logging in: " + error);
        });
    })
      .catch(error => {
        console.error("FB: Error initializing " + error)
        firebase.crashlytics.log("FB: Error initializing: " + error)
        // TODO this should cause a modal popup, with a 'try again later'
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
