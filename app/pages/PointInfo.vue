<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="250,auto,*" columns="*" iosOverflowSafeArea="true">
      <ImageCarousel height="250" row="0" :images="images"></ImageCarousel>
      <ScrollView row="2">
        <StackLayout class="descriptions">
          <Label :text="point.title" class="h2 name" textWrap="true"></Label>
          <Label :text="point.description" class="body description" textWrap="true"></Label>
          <StackLayout v-if="point.routeDescription" class="hr m-10"></StackLayout>
          <Label v-if="point.routeDescription" :text="point.routeDescription" class="body description" textWrap="true"></Label>
          <Button verticalAlignment="top" horizontalAlignment="right" class="-outline floatButton" :text="'btn.goto' | L" @tap="openNavigationTo"></Button>

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
import { Directions } from "nativescript-directions";
import ImageCarousel from "~/components/ImageCarousel";
import AudioPlayer from "~/components/AudioPlayer";

export default {
  components: {
    ImageCarousel,
    AudioPlayer
  },
  mounted() {},
  props: ["point"],
  methods: {
    onLoaded() {
      this.$store.commit("setCurrentPage", {
        name: "pointinfo",
        instance: this
      });
    },
    openNavigationTo() {
      console.log("open maps application to go to:", this.point.title);
      let directions = new Directions();
      directions.available().then(avail => {
        if (avail) {
          directions
            .navigate({
              to: {
                lat: this.point.position.latitude,
                lng: this.point.position.longitude
              }
            })
            .then(
              function() {
                console.log("Maps app launched.");
              },
              function(error) {
                console.log(error);
              }
            );
        } else {
          this.$store.setMessage("No maps application found to open");
        }
      });
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    images() {
      if (this.point) {
        return this.point.files.filter(file => file.type == "image");
      }
      return [];
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
