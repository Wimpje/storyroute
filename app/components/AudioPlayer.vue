<template>
  <GridLayout v-if="audioFile" height="50" columns="50,*" @loaded="loaded" class="container" >
    <CenterLabel
      @tap="playPause"
      col="0"
      :centerMethod="17"
      :text="icon"     
      class="fas fabButton"
      :class="loading ? 'loading' : 'loaded'"
    ></CenterLabel>
    <Label col="1" height="4" class="progressBackground" :class="loading ? 'loading' : 'loaded'" horizontalAlignment="left" width="100%" />
    <Label col="1" height="4" class="progress" :class="loading ? 'loading' : 'loaded'" horizontalAlignment="left" :width="progress" />
  </GridLayout>
</template>

<script>
export default {
  props: ["files", "autoPlay"],
  data() {
    return {
      src: "",
      loading: false,
      inError: false,
      progress: '0',
      playing: false,
      progressInterval: null
    };
  },
  created() {},
  beforeDestroy() {
    this.$player.pause();
    clearInterval(this.progressInterval)
  },
  computed: {
    
    icon() {
      if(this.loading) {
        return this.iconFromCode('0xf110')
      }
      if(this.playing) 
        return this.iconFromCode('0xf04d')
      else 
        return this.iconFromCode('0xf04b')
    },
    audioFile() {
      if (this.files && this.files.length > 0) {
        const audioFiles = this.files.filter(file => file.type == "audio");
        if (audioFiles && audioFiles.length > 0) {
          return audioFiles[0].firebaseUrl;
        }
      }
      return null;
    }
  },
  watch: {
    playing(oldVal, newVal) {
      if (typeof newVal !== 'undefined') {
       if (!newVal) {
         console.log('starting progress checker')
         this.progressInterval = this.createProgressChecker()
       }
       else {
         console.log('clearing progress checker')
         clearInterval(this.progressInterval)
       }
      }
    }
  },
  methods: {
    createProgressChecker() {
      return setInterval(() => {
        if(this.$player.duration === 0) {
          this.progress = '0';
          console.log('progress = 0')
          return 
        }
        this.progress = Math.round((this.$player.currentTime / this.$player.duration) * 100) + '%'
        console.log(`progress= ${this.progress}, duration=${this.$player.duration}, current=${this.$player.currentTime}`)
      }, 200)
    },
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    },
    loaded(args) {

    },
    infoCallback(args) {
      console.log('INFO CALLBACK', args)
    },
    finishedCallback(args) {
      console.log('finished playing', args)
    },
    playPause() {
      if (this.$player.isLoading) {
        // ignore press, it's loading
        return
      }
      if (this.$player.readyToPlay && this.$player.currentFile === this.audioFile) {
        this.$player.togglePlay().then(res => {
          this.playing = this.$player.isPlaying
        }).catch((err) => {
          this.playing = false
          this.inError = true;
        })
      }
      else {
        this.initFromUrl()
      }
    },
    initFromUrl() {
      this.loading = true
      const opts = {infoCb: this.infoCallback, finishedCb: this.finishedCallback, autoPlay: !!this.autoPlay }
      this.$player.playUrl(this.audioFile, opts).then(res => {
        this.loading = false
        this.playing = true
      }).catch(err => {
        // handle error
        this.loading = false
        this.inError = true
        this.playing = false
      });
    }
  }
};
</script>


<style scoped lang="scss">
//@import "~@nativescript/theme/scss/variables/grey";

@keyframes spin { 
  from { transform:rotate(0); }
  to { transform:rotate(360deg);  } 
}

@keyframes pulse { 
  0%   { background-color: black; }
  50%  { background-color: #cccccc; }
  100% { background-color: #222222; }
}

.container {
  margin: 10;
}
.ns-light .fabButton {
  background-color: black;
  color: white;
}
.fabButton {
  height: 50;
  width: 50;
  border-radius: 100;
  font-size: 18;
  &.loading {
    animation: spin;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
}
.loading {
  opacity: 0.5
}
.ns-dark .fabButton {
  background-color: white;
  color: black;
}
.progress {
  background-color: black;
  margin-right:20;
}
.progressBackground {
  background-color: gray;
  margin-right:20;
  &.loading {
    animation: pulse;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite; 
  }
}
</style>
