import fb from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage';
import 'firebase/auth';


const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID
}

fb.initializeApp(config);

const firebasePlugin = {
  auth() {
    return fb.auth()
  },
  install(Vue) {
    Vue.prototype.$firebase = fb
  }
}

export default firebasePlugin
