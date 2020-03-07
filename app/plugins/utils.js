import { getRootView } from "tns-core-modules/application"
import Vue from 'nativescript-vue'
import { Frame } from '@nativescript/core/ui/frame';

import { routes, routeInfo } from "~/router";
import SelectedPageService from "~/plugins/selected-page-service";

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
export function findParentFrame(vm) {
  if (!vm) {
    return false
  }
  let entry = vm.$parent
  while (entry && entry.$options.name !== 'Frame') {
    console.log(entry.$options.name)
    entry = entry.$parent

  }

  return entry
}
export const navigateTo = (page, item) => {
  const topFrame = Frame.topmost();

  if (item.isTabView) {
    // ugly, fix
    const bottomNav = topFrame.parent.parent;
    bottomNav.selectedIndex = item.tabIndex
  }
  else
    page.$showModal(item.page, {
      fullscreen: true
    })

}


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
