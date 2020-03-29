<template>
  <Page class="page" @loaded="onLoaded"  actionBarHidden="true">
    <GridLayout rows="250, *, auto" columns="*" iosOverflowSafeArea="true">
      <ImageCarousel height="250" row="0" :images="images"></ImageCarousel>
      <ScrollView row="1">
        <StackLayout>
          <GridLayout class="routeInfo" columns="auto, auto, *" rows="auto, *">
            <CenterLabel col="0" row="0" :text="travelModeIcon" class="h2 travelMode fas"></CenterLabel>
            <CenterLabel col="1" row="0" :text="distance" class="h3 distance"></CenterLabel>
            <Label
              col="2"
              row="0"
              :centerMethod="17"
              :text="route.title"
              class="h2 text-left m-y-auto routeName"
              textWrap="true"
            ></Label>
          </GridLayout>
          <StackLayout>
            <Label :text="route.description" class="body p-20 routeDescription" textWrap="true"></Label>
            <Button
              verticalAlignment="bottom"
              horizontalAlignment="right"
              :text="'btn.startRoute' | L"
              @tap="startRoute()"
            ></Button>
            <StackLayout class="hr m-10"></StackLayout>
            <StackLayout orientation="horizontal">
              <Label
                text.decode="&#xf5eb;"
                class="fas t-24 p-l-20 p-y-20"
                horizontalAlignment="center"
              ></Label>
              <Label :text="'route.directions' | L" class="h1 p-20 m-x-auto"></Label>
            </StackLayout>
            <GridLayout
              rows="auto, *"
              columns="auto,*"
              v-for="(poi, i) in route.pois"
              :key="poi.id"
            >
              <Label row="0" col="0" class="h2 p-y-20 p-l-20" :text="(i + 1) + '. '"></Label>
              <Label row="0" col="1" class="h2 p-y-20" :text="poi.title"></Label>
              <Label
                row="1"
                colSpan="2"
                class="body p-x-20 routeDescription"
                :text="poi.routeDescription"
                textWrap="true"
              ></Label>
            </GridLayout>
          </StackLayout>
        </StackLayout>
      </ScrollView>

      <StackLayout class="actions" row="2">
        <AudioPlayer :files="route.files" />
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>
import ImageCarousel from "~/components/ImageCarousel";
import * as utils from "~/plugins/utils";
import AudioPlayer from "~/components/AudioPlayer";
import { device } from "@nativescript/core/platform";
import Route from "~/pages/Route.vue";

export default {
  components: { AudioPlayer, ImageCarousel },
  props: ["route"],
  methods: {
    getLanguage() {
      return device.language.split("-")[0];
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", {
        name: "routeinfo",
        instance: this
      });
    },
    startRoute() {
      this.$myNavigateTo("route", { props: { route: this.route } });
    },
    close() {
      this.$navigateBack();
    },
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    }
  },
  computed: {
    distance() {
      if (this.route.distance) return this.route.distance + "km";
      return "";
    },
    travelModeIcon() {
      if (this.route && this.route.travelMode) {
        switch (this.route.travelMode) {
          case "WALKING":
            return String.fromCharCode("0xf554");
          case "BIKING":
            return String.fromCharCode("0xf206");
          case "DRIVING":
            return String.fromCharCode("0xf1b9");
          default:
            return String.fromCharCode("0xf05a");
        }
      }
      return String.fromCharCode("0xf05a");
    },
    images() {
      if (this.route) {
        return this.route.files.filter(file => file.type == "image");
      }
      return [];
    },
    showPointRouteDescriptions() {
      this.showDescriptions = !this.showDescriptions;
    }
  },
  data() {
    return {
      showDescriptions: false
    };
  }
};
</script>
<style scoped lang="scss">
.fabButton {
  margin-right: 20;
  color: white;
  margin-bottom: 20;
  background-color: black;
  border-radius: 100;
}

.routeImage {
  margin-bottom: 10;
}
.travelMode {
  margin: 15 10 10 20;
}
.distance {
  margin: 15;
}

.routeInfo {
  background-color:#ccc;
}
.routeDescription {
  vertical-align: top;
  font-size: 16;
}
.routeName {
  padding: 5 20 5 20;
}
</style>
