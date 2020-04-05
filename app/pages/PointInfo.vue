<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="auto, *" columns="*" iosOverflowSafeArea="true">
      <ScrollView row="0">
        <StackLayout class="descriptions">
          <ImageCarousel height="200" :images="images"></ImageCarousel>
          <Label :text="point.title" class="h2 name" textWrap="true"></Label>
          <Label :text="point.description" class="body description" textWrap="true"></Label>
          <StackLayout  v-if="point.routeDescription">
            <StackLayout class="hr m-10"></StackLayout>
            <StackLayout orientation="horizontal">
              <Label
                text.decode="&#xf5eb;"
                class="fas t-24 p-l-20 p-y-20"
                horizontalAlignment="center"
              ></Label>
              <VideoPlayer v-if="video"
                :src="video"
                autoplay="false"
                height="250"
                loop="false"
                muted="false"
                ref="video"
                ></VideoPlayer>
              <Label :text="'route.directions' | L" class="h1 p-20 m-x-auto"></Label>
            </StackLayout>
            <Label :text="point.routeDescription" class="body description" textWrap="true"></Label>
            <UrlContents row="2" class="p-20 m-t-10" :addDivider="true" :urls="point.urls"></UrlContents>
          </StackLayout>
        </StackLayout>
      </ScrollView>
      <StackLayout class="actions" row="1">
        <AudioPlayer :files="point.files" />
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>
import * as utils from "~/plugins/utils";
import ImageCarousel from "~/components/ImageCarousel";
import AudioPlayer from "~/components/AudioPlayer";
import * as firebase from "nativescript-plugin-firebase";
import UrlContents from "~/components/UrlContents";

export default {
  components: {
    ImageCarousel,
    UrlContents,
    AudioPlayer
  },
  mounted() {
    this.$store.commit('setCurrentPoi', this.point)
  },
  destroy() {
    console.log("DESTROY poi")
    this.$store.commit('setCurrentPoi', null)
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
   
    close() {
      this.$modal.close();
    }
  },
  destroy(){
    console.log('destroy video player')
    if (this.$refs.video && this.$refs.video.nativeView)
      this.$refs.video.nativeView.destroy();
  },
  computed: {
    images() {
      if (this.point) {
        return this.point.files.filter(file => file.type == "image");
      }
      return [];
    },
    video() {
      if (this.point) {
        const videos =  this.point.files.filter(file => file.type == "video");
        if(videos && videos.length) {
          return videos[0].firebaseUrl
        }
      }
      return ''
    }
  },
  data() {
    return {};
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
  padding: 5 20 5 20;
}
</style>
