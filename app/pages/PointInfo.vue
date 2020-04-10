<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*" columns="*" iosOverflowSafeArea="true">
      <ScrollView row="0">
        <StackLayout class="descriptions">
          <ImageCarousel height="200" :images="images"></ImageCarousel>
          <AudioPlayer :files="point.files" />
          <GridLayout rows="auto" v-if="video" @tap="play" >
          
            <VideoPlayer 
              row="0"
              :src="video"
              @loaded="videoPlayerLoaded"
              autoplay="false"
              controls="true"
              height="250"
              loop="false"
        
              muted="false"
              ref="video"></VideoPlayer>
              <android>
                <CenterLabel v-if="!playing" text.decode="&#xf04b;" row="0" height="250" width="100%" class="fas play" verticalAlignment="middle" horizontalAlignment="middle" />
              </android>
          </GridLayout>

          <Label :text="point.title" class="h2 name" textWrap="true"></Label>
          <Label :text="point.description" class="body description" textWrap="true"></Label>
          <StackLayout v-if="point.routeDescription">
            <StackLayout class="hr m-10"></StackLayout>
            <StackLayout orientation="horizontal">
              <Label
                text.decode="&#xf5eb;"
                class="fas t-24 p-l-20 p-y-20"
                horizontalAlignment="center"
              ></Label>
              <Label :text="'route.directions' | L" class="h1 p-20 m-x-auto"></Label>
            </StackLayout>
            <Label :text="point.routeDescription" class="body description" textWrap="true"></Label>
            <UrlContents row="2" class="p-20 m-t-10" :addDivider="true" :urls="point.urls"></UrlContents>
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>
<script>
import * as utils from "~/plugins/utils";
import ImageCarousel from "~/components/ImageCarousel";
import AudioPlayer from "~/components/AudioPlayer";
import * as firebase from "nativescript-plugin-firebase";
import UrlContents from "~/components/UrlContents";
import { isAndroid } from "tns-core-modules/platform";

export default {
  components: {
    ImageCarousel,
    UrlContents,
    AudioPlayer
  },
  mounted() {
    this.$store.commit('setCurrentPoi', this.point)
  },
  beforeDestroy() {
    console.log("DESTROY poi & video player (if exists)")
    this.$store.commit('setCurrentPoi', null)
    if (this.$refs.video && this.$refs.video.nativeView)
      this.$refs.video.nativeView.destroy();
  },
  props: ["point"],
  methods: {
    onLoaded() {
      this.$store.commit("setCurrentPage", {
        name: "pointinfo",
        title: this.point.title,
        instance: this
      });
    },
    videoPlayerLoaded(args) {
      if(this.video) {
        // workaround to show thumbnail on load
       // if(isAndroid)
         // this.$refs.video.nativeView.seekToTime(5)
      }
    },
    play() {
      if (isAndroid) {
        this.$refs.video.nativeView.play()
        this.playing = true
      }
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    images() {
      if (this.point && this.point.files) {
        return this.point.files.filter(file => file.type == "image");
      }
      return [];
    },
    video() {
      if (this.point && this.point.files) {
        const videos =  this.point.files.filter(file => file.type == "video");
        if(videos && videos.length) {
          return videos[0].firebaseUrl
        }
      }
      return ''
    }
  },
  data() {
    return {
      playing: false
    };
  }
};
</script>
<style scoped>
.image {
  margin-bottom: 10;
}

.info {
  background-color: #489e9e9e;
}
.floatButton {
  margin-bottom: 20;
  margin-top: 60;
}
.description {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 16;
}
.name {
  margin-top: 10;
  padding: 5 20 5 20;
}
.play {
  opacity: 0.5;
  color: white;
  font-size: 50;
  text-align: center;
  vertical-align: middle;
  background-color: black;
}
</style>
