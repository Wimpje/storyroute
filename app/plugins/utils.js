import { getRootView } from "tns-core-modules/application"
import { Frame } from '@nativescript/core/ui/frame';
import store from '~/store/index.js'
import Vue from 'nativescript-vue'
import { Span } from "text/span";
import { FormattedString } from "text/formatted-string"

export const showDrawer = () => {
  let drawerNativeView = getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer();
  }
}

export const closeDrawer = () => {
  let drawerNativeView = getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.closeDrawer();
  }
}
export function findNav(frame) {
  if (!frame) {
    return false
  }
  while (frame && frame.typeName !== 'BottomNavigation') {
    frame = frame.parent
  }
  return frame
}

// super basic markdown like formatting for headers and such
export const createFormattedString = (text) => {
  const str = new FormattedString();
  const lines = text.split(/\n/)

  lines.forEach(line => {
    let s = new Span();
    line += '\n'
    // heading
    if (line.indexOf('###') == 0) {
      s.text = line.substring(3);
      s.className = "h4"
    }
    else if (line.indexOf('##') == 0) {
      s.text = line.substring(2);
      s.className = "h3"
    }
    else if (line.indexOf('#') == 0) {
      s.text = line.substring(1);
      s.className = "h2"
    }
    // manual lineBreak
    else if (line.length === 3 && line.indexOf('---') === 0) {
      s.text = line.substring(3);
      const lineEnd = new Span()
      lineEnd.text = '\n\n'
      str.spans.push(lineEnd)
    }
    else {
      s.text = line
    }
    str.spans.push(s)
  })
  return str
}


export const showMessageLocalized = (text) => {
  Vue.prototype.$toast.show(text, {shouldLocalize: true})
}

Vue.prototype.$myNavigateBack = function() {
  const page = store.getters.currentPage
  const tabIndex = store.getters.bottomNavigationIndex
  console.log('Navigate back!', page.name)
  store.commit('popPage')

  const pagesInfo = store.getters.pagesInfo
  const item = pagesInfo[page.name];
  if (item.isModal) {
    console.log('is modal, closing')
    page.instance.$modal.close()
  }
  else if(item.isTabView) {
    // don't do anything
  }
  else {
    const frame = item.mainContent ? 'mainContent' : 'frameTab' + tabIndex
    // following line does not work, it cannot find parent frame id
    console.log('is part of tab, go back', frame)
    page.instance.$navigateBack( {frame: frame})
    // so just go back to 'routes' as home, and if on home, show the 'doubletapper'
   // page.instance.$navigateTo(pagesInfo.routes.page)
  }
}

Vue.prototype.$navigateBackFromButton = function() {
  const page = store.getters.currentPage
  
  if (!page) { 
    console.log('show doubletap message...')
    showMessageLocalized('nav.doubletap')
    // no page to go back to... return
    return
  }

  const pagesInfo = store.getters.pagesInfo
  const item = pagesInfo[page.name];
  if (item.isTabView) {
    showMessageLocalized('nav.doubletap')
  }
  Vue.prototype.$myNavigateBack()
}

Vue.prototype.$myNavigateTo = function(to, props) {
  const topFrame = Frame.topmost();
  console.log(`navigation! topframe = ${topFrame.id}, going to ${to}`)
  const pagesInfo = store.getters.pagesInfo
  const toPage = pagesInfo[to];
  const bottomNav = findNav(topFrame)
  const tabIndex = store.getters.bottomNavigationIndex
  if (!bottomNav) {
    console.error('bottom nav not found!')
    // hack:
    bottomNav = { selectedIndex: 0}
  } else {
    console.log(`Navigating! current bottomNav idx = ${bottomNav.selectedIndex} in store = ${tabIndex}`)
  }
  const currentPage = store.getters.currentPage

  if (toPage.isTabView) {
    console.log('... tabview, open in bottom nav: index=', toPage.tabIndex)
    bottomNav.selectedIndex = toPage.tabIndex
  }
  else if (toPage.isModal) {
    console.log('... modal, open in modal')
    const that = this
    Vue.showMyModal(toPage.page, {
      ...props, 
      ...toPage.props
    }).then(res => {
      console.log('closing modal', props)
      console.log('... and setting currentPage back to where we came from', currentPage.name)
      store.commit("setCurrentPage", { name: currentPage.name, instance: that });
    })
  }
  else {
    // determine which frame to go to
    const frame = toPage.mainContent ? 'mainContent' : 'frameTab' + tabIndex
    const p = { ...props, frame: frame }

    console.log('... navigating in frame='+frame+' to page ', toPage.name, p)

    this.$navigateTo(toPage.page, p).then(res => {
      console.log('yeah! i navigated from the utils.js thingy to ' + to)
    }).catch(err => console.error('error navigating', err))
  }
}

export const filterObject = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));


// https://github.com/vuejs/vuex/tree/dev/src/util.js
/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise(val) {
  return val && typeof val.then === 'function'
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

export function partial(fn, arg) {
  return function () {
    return fn(arg)
  }
}

export function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}
