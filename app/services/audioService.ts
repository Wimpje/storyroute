import { TNSPlayer } from 'nativescript-audio';

// can probably be abstracted even more (since the name of the collection is all that is different from routes / news / whatever colelction)
export class AudioService {
  private _player: TNSPlayer;
  
  constructor() {
    this._player = new TNSPlayer();
    this._player.debug = TNS_ENV !== 'production'

  }

  public togglePlay() {
    if (this._player.isAudioPlaying()) {
      this._player.pause();
    } else {
      this._player.play();
    }
  }
  public resume() {
    return this._player.resume()
  }

  public pause() {
    return this._player.pause()
  }

  public dispose() {
    return this._player.dispose()
  }

  public playUrl(url) {
    const playerOptions = {
      audioFile: url,
      loop: false,
      completeCallback: function() {
        console.log('finished playing');
      },
      errorCallback: function(errorObject) {
        console.log(JSON.stringify(errorObject));
      },
      infoCallback: function(args) {
        console.log(JSON.stringify(args));
      }
    };

    return this._player.playFromUrl(playerOptions).then(res => {
      console.log(res)
    }).catch(err => {
      // TODO user interaction
      console.error(err)
    })
  }

  
};
