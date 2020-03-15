import App from "~/pages/App.vue";
import Home from "~/pages/Home.vue";
import Points from "~/pages/Points.vue";
import PointInfo from "~/pages/PointInfo.vue";
import Route from "~/pages/Route.vue";
import Routes from "~/pages/Routes.vue";
import Config from "~/pages/Config.vue";
import News from "~/pages/News.vue";
import TestGeo from "~/pages/TestGeo.vue";
import RouteInfo from "~/pages/RouteInfo.vue";
import * as utils from "~/plugins/utils";


const pages = {
  app: App,
  home: Home,
  points: Points,
  pointinfo: PointInfo,
  route: Route,
  routes: Routes,
  config: Config,
  news: News,
  testgeo: TestGeo,
  routeinfo: RouteInfo
};

const pagesInfo = {
  routes: { icon: "0xf4d7", text: "Routes", page: pages.routes, sideDrawer: true, isTabView: true, tabIndex: 0, 
            childPages: [ 'route', 'routeinfo' ] },
  points: { icon: "0xf5a0", text: "Kaart", page: pages.points,  sideDrawer: true, isTabView: true, tabIndex: 1, 
            childPages: [ 'pointInfo' ] },
  news: { icon: "0xf4d7", text: "News", page: pages.news,  sideDrawer: true, isTabView: true, tabIndex: 2 },
  // no tab navigation for the following:
  route: { icon: "0xf4d7", text: "Route", page: pages.route, sideDrawer: false, isTabView: false, isModal: true },
  routeinfo: { icon: "0xf4d7", text: "Route info", page: pages.routeinfo, sideDrawer: false, isTabView: false, isModal: true },
  pointInfo: { icon: "0xf4d7", text: "Point info", page: pages.pointinfo, sideDrawer: false, isTabView: false, isModal: true },
  testgeo: { icon: "0xf4d7", text: "Geo test", page: pages.testgeo, sideDrawer: false, isTabView: false, isModal: true },
  config: { icon: "0xf4d7", text: "Config", page: pages.config,  sideDrawer: true, isTabView: false, isModal: true }
}

export const state = () => {
  return {
    currentPage: '',
    pageStack: [],
    pagesInfo: pagesInfo,
  }
}
export const getters = {
  currentPage (state) {
    return state.currentPage
  },
  currentComponent (state) {
    // no error checking, we're in control so _of course_ this will never crash...
    return state.pagesInfo[state.currentPage].page
  },
  currentIcon (state) {
    return state.pagesInfo[state.currentPage].icon
  },
  currentIsTabView (state) {
    return state.pagesInfo[state.currentPage].isTabView
  },
  pagesInSideDrawer (state) {
    const sideDrawerPages = Object.values(state.pagesInfo).filter(value => {
      return value.sideDrawer
    })
    
    return sideDrawerPages
  },
  pagesInTabNavigation (state) {
    const res = Object.values(state.isTabView).filter(value => {
      return value.sideDrawer
    })
    return res

  },
  pages (state) {
    return Object.values(state.pagesInfo)
  },
  pagesInfo (state) {
    return state.pagesInfo
  }
}

export const mutations = {
  setCurrentPage (state, page) {
    state.currentPage = page
  },
  pagePop (state) {
    state.pageStack.pop()
  },
  pagePush (state, page) {
    state.pageStack.push(page)
  }
}

export default {
  state,
  getters,
  mutations
}
