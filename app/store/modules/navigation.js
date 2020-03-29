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
import ArticleInfo from "~/pages/ArticleInfo.vue";
import * as utils from "~/plugins/utils";
import * as firebase from"nativescript-plugin-firebase";
import { getBoolean } from "tns-core-modules/application-settings";

const pages = {
  app: App,
  home: Home,
  points: Points,
  pointinfo: PointInfo,
  routes: Routes,
  route: Route,
  routeinfo: RouteInfo,
  config: Config,
  news: News,
  testgeo: TestGeo,
  articleinfo: ArticleInfo
};

const pagesInfo = {
  // having the name again is a bit overkill, but handy sometimes
  routes: {     name: 'routes', icon: "0xf4d7", text: "nav.routes", page: pages.routes, sideDrawer: true, isTabView: true, tabIndex: 0 },
  points: {     name: 'points', icon: "0xf5a0", text: "nav.points", page: pages.points, sideDrawer: true, isTabView: true, tabIndex: 1 },
  news: {       name: 'news', icon: "0xf143", text: "nav.news", page: pages.news, sideDrawer: true, isTabView: true, tabIndex: 2 },
  
  // no tab navigation for the following:
  route: {      name: 'route', icon: "0xf4d7", text: "nav.route", page: pages.route, sideDrawer: false, isTabView: false, isModal: false, isChild: true, tabIndex: 0 },
  routeinfo: {  name: 'routeinfo', icon: "0xf4d7", text: "nav.routeinfo", page: pages.routeinfo, sideDrawer: false, isTabView: false, isModal: false, isChild: true, tabIndex: 0 },
  pointinfo: {  name: 'pointinfo', icon: "0xf3c5", text: "nav.pointinfo", page: pages.pointinfo, sideDrawer: false, isTabView: false, isModal: false, isChild: true, tabIndex: 1 },
  testgeo: {    name: 'testgeo', icon: "0xf7a2", text: "nav.geotest", page: pages.testgeo, sideDrawer: false, isTabView: false, isModal: true, props: { fullscreen: true } },
  config: {     name: 'config', icon: "0xf013", text: "nav.config", page: pages.config, sideDrawer: true, isTabView: false, isModal: true, props: { fullscreen: true }  },
  articleinfo: {name: 'articleinfo', icon: "0xf4d7", text: "nav.articleinfo", page: pages.articleinfo, sideDrawer: false, isTabView: false, isModal: false, isChild: true, tabIndex: 2  }
}

export const state = () => {
  return {
    currentPage: {name: 'routes', instance: null},
    previousPage: {name: '', instance: null},
    pagesInfo: pagesInfo,
    bottomIndex: 0
  }
}
export const getters = {

  currentPage(state) {
    return state.currentPage
  },
  previousPage(state) {
    return state.previousPage
  },
  currentPageInfo(state) {
    return state.pagesInfo[state.currentPage.name]
  },
  currentComponent(state) {
    // no error checking, we're in control so _of course_ this will never crash...
    return state.pagesInfo[state.currentPage.name].page
  },
  currentIcon(state) {
    return state.pagesInfo[state.currentPage.name].icon
  },
  currentPageInstance(state) {
    return state.currentPage.instance
  },
  currentPageText(state) {
    if(state.currentPage) {
      return state.pagesInfo[state.currentPage.name].text
    }
    else {
      // default is routes
      return state.pagesInfo['routes'].text
    }
  },
  currentIsTabView(state) {
    if(state.currentPage && state.pagesInfo[state.currentPage.name]) {
      return state.pagesInfo[state.currentPage.name].isTabView
    }
    else {
      // default is routes
      return true
    }
  },
  pagesInSideDrawer(state) {
    const sideDrawerPages = Object.values(state.pagesInfo).filter(value => {
      return value.sideDrawer
    })

    return sideDrawerPages
  },
  pagesInTabNavigation(state) {
    const res = Object.values(state.pagesInfo).filter(value => {
      return value.isTabView
    })
    return res
  },
  pages(state) {
    return Object.values(state.pagesInfo)
  },
  pagesInfo(state) {
    return state.pagesInfo
  }
}

export const mutations = {
  setCurrentPage(state, page) {
    state.currentPage = page
    if (getBoolean('googleAnalytics')) {
      firebase.analytics.setScreenName({
        screenName: page.name
      }).then(
          function () {
            console.log("Screen name set", page.name);
          }
      );
    }
  },
  bottomNavigatedTo(state, index) {
    state.bottomIndex = index
  },
  popPage(state) {
    return state.previousPage = state.currentPage
  },
  
}

export default {
  state,
  getters,
  mutations
}
