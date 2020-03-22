<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
      <ImageCarousel row="0" :images="images"></ImageCarousel>
      <GridLayout class="info" row="1" rows="auto, *, auto">
        <Label row="0" :text="point.title" class="h1 name" textWrap="true"></Label>
        <Label row="1" :text="point.description" class="body description" textWrap="true"></Label>
        <Button row="2" v-if="audioFile" text="play" @tap="playAudio"></Button>
      </GridLayout>

      <StackLayout class="actions" row="2">
        <Button class="-outline" :text="'close' | L" @tap="close"></Button>
        <Button class="-outline" :text="'goto' | L" @tap="openNavigationTo"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>

import * as utils from "~/plugins/utils";
import { Directions }from "nativescript-directions"
import ImageCarousel from "~/components/ImageCarousel"

export default {
  components: {
    ImageCarousel
  },
  mounted() {
  },
  props: ["point"],
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'pointinfo', instance: this })
    },
    openNavigationTo(){
      console.log('open maps application to go to:', this.point.title)
      let directions = new Directions();
      directions.available().then(avail => {
          if (avail) {
            directions.navigate({
              to: {
                lat: this.point.position.latitude,
                lng: this.point.position.longitude
              }
            }).then(
              function() {
                console.log("Maps app launched.");
              },
              function(error) {
                console.log(error);
              }
            );
          }
          else {
            this.$store.setMessage('No maps application found to open')
          }
      });
    },
    close() {
      this.$modal.close();
    },
    playAudio() {
      this.$player.playUrl(this.audioFile)
    }
  },
  computed: {
    audioFile() {
      if (this.point) {
        const audioFiles = this.point.files.filter(file => file.type == 'audio')
        if(audioFiles && audioFiles.length > 0) {
          return audioFiles[0].firebaseUrl
        }
      }
      return null
    },
    images() {
      if (this.point) {
        return this.point.files.filter(file => file.type == 'image')
      }
      return []
    }
  },
  data() {
    return {

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
.description {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 18;
}
.name {
  padding: 5 20 5 20;
}
</style>
