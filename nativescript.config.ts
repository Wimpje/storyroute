import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'nl.nosmallthing.ommen75jaarbevrijding',
  appPath: 'app',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
} as NativeScriptConfig
