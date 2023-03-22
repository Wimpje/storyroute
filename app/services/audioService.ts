import { TNSPlayer } from 'nativescript-audio';

// can probably be abstracted even more (since the name of the collection is all that is different from routes / news / whatever colelction)
export class AudioService {
  private _player: TNSPlayer;
  private _fileInitialized: Boolean;
  private _currentFile: String;
  private _loading: Boolean;
  private _currentTrackDuration: Number

  constructor() {
    this._player = new TNSPlayer();
    this._player.debug = __DEV__
    this._fileInitialized = false
    this._currentFile = null
    this._loading = false
    this._currentTrackDuration = 0
  }

  public get duration(): Number {
    return this._currentTrackDuration
  }

  public get currentTime(): Number {
    return this._player.currentTime
  }


  public get isPlaying(): Boolean {
    return this._player.isAudioPlaying()
  }

  public get readyToPlay(): Boolean {
    return !this._loading && this._fileInitialized
  }
  
  public get isLoading(): Boolean {
    return this._loading
  }

  public get currentFile(): String {
    return this._currentFile
  }

  public togglePlay() {
    return new Promise((resolve, reject) => {
      if (this._player.isAudioPlaying()) {
        this._player.pause().then(() => resolve('pause')).catch(err => reject(err));
      } else {
        this._player.resume();
        resolve('resume')
      }
    })
  }
  public getCurrentTime() {
    return this._player.currentTime
  }

  public resume() {
    return this._player.resume()
  }

  public pause() {
    return this._player.pause()
  }

  public dispose() {
    this._fileInitialized = false
    this._currentFile = null
    return this._player.dispose()
  }

  public playUrl(url, opts) {
    this._loading = true
    if (this._currentFile) {
      this.dispose()
      this._player = new TNSPlayer();
    }
    this._currentFile = url
    console.log('play audio url', url)
    return new Promise((resolve, reject) => {
      const playerOptions = {
        audioFile: url,
        loop: false,
        completeCallback: (res) => {
          console.log('finished playing', res);
          if (opts && opts.finishedCb) {
            opts.finishedCb(res)
          }
        },
        errorCallback: function (errorObject) {
          console.log(JSON.stringify(errorObject));
          reject({ status: 'error', result: errorObject })
        },
        infoCallback: function (args) {
          if (opts && opts.infoCb) {
            opts.infoCb(args)
          }
        }
      };
      console.log('starting to play url:', url, playerOptions)
      this._player.playFromUrl(playerOptions).then(res => {
        console.log('init complete', res)
        this._fileInitialized = true
        this._loading = false
        this._player.getAudioTrackDuration().then(res => {
          console.log('track duration = ', res)
          this._currentTrackDuration = parseInt(res);
        })
        resolve({ status: 'complete', result: res })
      }).catch(err => {
        console.log('init error ', err)
        reject({ status: 'error', result: err })
        this._loading = false
        this._fileInitialized = false
      })
    })
  }


};
