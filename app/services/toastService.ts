import { Toasty, ToastPosition, ToastDuration, ToastyOptions } from '@triniwiz/nativescript-toasty'
import { localize } from "@nativescript/localize";
import { Color } from "@nativescript/core/color";
import { crashlytics } from "@nativescript/firebase/crashlytics";


export class ToastService {
  private currentToast;
  private defaults: ToastyOptions;

  constructor() {
    this.currentToast = null;
    this.defaults = {
      text: '',
      duration: ToastDuration.LONG,
      position: ToastPosition.BOTTOM,
      yAxisOffset: 20,
      textColor: new Color('white'),
      backgroundColor: '#222222'
    }
  }

  async error (text, error) {
    await crashlytics.sendCrashLog({
      message: text + ' - ' + JSON.stringify(error, null, 2),
      showInConsole: true
    })
  }

  async errorFriendly(text, opts) {
    const errorMsg = opts.error ? `${text} - ${JSON.stringify(opts.error, null, 2)}` : text
    this.show(text, {
      backgroundColor: '#5d0101', // dark red warning like error thingy
      ...opts
    });
    await crashlytics.sendCrashLog({
      message: errorMsg,
      showInConsole: true
    })
  }

  cancel() {
    if (this.currentToast && 'cancel' in this.currentToast)
      this.currentToast.cancel()
  }

  async show(text, opts) {
    this.cancel()

    if (!opts) {
      opts = {
        shouldLocalize: false,
        ...this.defaults
      }
    }
    else {
      opts = Object.assign({}, this.defaults, opts)
    }
    opts.text = opts.shouldLocalize ? localize(text) : text
    this.currentToast = new Toasty(opts)
    this.currentToast.show()
  }
};
