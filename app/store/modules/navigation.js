import App from "~/pages/App.vue";
import Home from "~/pages/Home.vue";
import Discover from "~/pages/Discover.vue";
import PointInfo from "~/pages/PointInfo.vue";
import Routes from "~/pages/Routes.vue";
import Config from "~/pages/Config.vue";
import Help from "~/pages/Help.vue";
import Articles from "~/pages/Articles.vue";
import TestGeo from "~/pages/TestGeo.vue";
import RouteInfo from "~/pages/RouteInfo.vue";
import ArticleInfo from "~/pages/ArticleInfo.vue";
import ImageInfo from "~/pages/ImageInfo.vue";
import * as utils from "~/plugins/utils";
import { firebase } from "@nativescript/firebase-core";
import { localize } from "@nativescript/localize";

const pages = {
  app: App,
  home: Home,
  discover: Discover,
  pointinfo: PointInfo,
  routes: Routes,
  routeinfo: RouteInfo,
  config: Config,
  help: Help,
  articles: Articles,
  testgeo: TestGeo,
  imageinfo: ImageInfo,
  articleinfo: ArticleInfo
};

const pagesInfo = {
  // having the name again is a bit overkill, but handy sometimes
  routes: {     name: 'routes', icon: "0xf4d7", text: "nav.routes", page: pages.routes, sideDrawer: true, isTabView: true, tabIndex: 0 },
  discover: {     name: 'discover', icon: "0xf06e", text: "nav.discover", page: pages.discover, sideDrawer: true, isTabView: true, tabIndex: 1 },
  articles: {   name: 'articles', icon: "0xf1ea", text: "nav.articles", page: pages.articles, sideDrawer: true, isTabView: true, tabIndex: 2 },
  
  // no tab navigation for the following:
  route: {      name: 'route', icon: "0xf4d7", text: "nav.route", page: pages.discover, sideDrawer: false, isTabView: false, isModal: false, menuItems: ['maps','share'] },
  routeinfo: {  name: 'routeinfo', icon: "0xf4d7", text: "nav.routeinfo", page: pages.routeinfo, sideDrawer: false, isTabView: false, isModal: false, menuItems: ['maps','share']},
  pointinfo: {  name: 'pointinfo', icon: "0xf3c5", text: "nav.pointinfo", page: pages.pointinfo, sideDrawer: false, isTabView: false, isModal: false, menuItems: ['maps','share'] },
  imageinfo: {  name: 'imageinfo', icon: "0xf7a2", text: "nav.imageinfo", page: pages.imageinfo, sideDrawer: false, isTabView: false, isModal: true, props: { fullscreen: true } },
  testgeo: {    name: 'testgeo', icon: "0xf7a2", text: "nav.geotest", page: pages.testgeo, sideDrawer: false, isTabView: false, isModal: true, props: { fullscreen: true } },
  config: {     name: 'config', icon: "0xf013", text: "nav.config", page: pages.config, sideDrawer: true, isTabView: false, isModal: false, mainContent: true  },
  help: {       name: 'help', icon: "0xf059", text: "nav.help", page: pages.help, sideDrawer: true, isTabView: false, isModal: false, mainContent: true },
  articleinfo: {name: 'articleinfo', icon: "0xf1ea", text: "nav.articleinfo", page: pages.articleinfo, sideDrawer: false, isTabView: false, isModal: false, menuItems: ['share'] }
}

export const state = () => {
  return {
    defaultPage: 'routes',
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
      if('title' in state.currentPage) 
        return state.currentPage.title

      return localize(state.pagesInfo[state.currentPage.name].text)
    }
    else {
      // default is routes
      return state.pagesInfo[state.defaultPage].text
    }
  },
  currentIsTabView(state) {
    const curPage = state.currentPage ? state.currentPage.name : state.defaultPage
    const ret  = state.pagesInfo[curPage].isTabView
    console.log('currentistabview', ret)
    return ret
  },
  currentMenuItems(state) {
    const curPage = state.currentPage ? state.currentPage.name : state.defaultPage
    return state.pagesInfo[curPage].menuItems
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
  },
  bottomNavigationIndex(state) {
    if(typeof state.bottomIndex === 'undefined') {
      console.warn('weird! bottomIndex === 0')
      return 0
    }
    return state.bottomIndex
  }
}

export const mutations = {
  setCurrentPage(state, page) {
    state.currentPage = page
  
    firebase().analytics().handleUserActivity({
      event: 'navigation',
      page: page.name
    })
    
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
