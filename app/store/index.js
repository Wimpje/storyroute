import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth.js'
import pois from './modules/pois.js'
import navigation from './modules/navigation.js'
import config from './modules/config.js'
import map from './modules/map.js'
import routes from './modules/routes'
import articles from './modules/articles'

import createLogger from '../plugins/logger'

Vue.use(Vuex)

const debug = false // process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    routes,
    navigation,
    pois,
    map,
    config,
    articles
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
