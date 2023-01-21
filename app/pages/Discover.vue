<template>
  <Page :class="screenOrientation" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*">
      <GoogleMap
        ref="gMap"
        row="0"
        :pois="listPois"
        :paths="paths"
        :padding="padding"
        @googleMapReady="onMapReady"
        @markerSelect="scrollToPoint"
      />

      <ScrollView
        row="0"
        v-if="showCategories"
        verticalAlignment="bottom"
        :marginBottom="marginBottomButtons"
        :width="widthButtons"
        orientation="horizontal"
      >
        <StackLayout orientation="horizontal">
          <Button
            v-for="category in categories"
            :key="category"
            
            :text="`discover.category.${category}` | L"
            @tap="filterCategory(category)"
            horizontalAlignment="center"
            verticalAlignment="middle"
            class="categoryButton m-x-4"
            :class="category == currentCategory ? 'selected' : ''"
          ></Button>
        </StackLayout>
      </ScrollView>

      <StackLayout
        row="0"
        :width="cardsContainerWidth"
        :height="cardsContainerHeight"
        :marginLeft="screenOrientation === 'landscape' ? 0 : 5"
        :marginTop="screenOrientation === 'landscape' ? 5 : 0"
        :verticalAlignment="verticalAlignment"
        :horizontalAlignment="horizontalAlignment"
      >
        <RadListView
          for="(poi, index) in listPois"
          ref="listView"
          :orientation="orientation"
          selectionBehavior="Press"
          @loaded="listviewLoaded = true"
          :height="screenOrientation === 'landscape' ? '100%' : 150"
          :width="screenOrientation === 'landscape' ? 150 : '100%'"
          @scrollDragEnded="onScrolled"
          multipleSelection="false"
          @itemSelected="onItemSelected"
          @itemDeselected="onItemDeselected"
          @itemDeselecting="onItemDeselecting"
          @itemTap="showPointInfoFromList"
        >
          <v-template>
            <GridLayout>
              <CardView class="cardStyle" radius="10" height="110" width="130">
                <GridLayout rows="auto, *" cols="auto" padding="2">
                  <Label
                    row="0"
                    col="0"
                    class="info"
                    horizontalAlignment="center"
                    verticalAlignment="top"
                    marginLeft="21"
                    textWrap="true"
                    :text="getPoiTitle(poi)"
                  >
                  </Label>
                  <CachedImage
                    verticalAlignment="bottom"
                    row="1"
                    col="0"
                    :source="getPoiImage(poi)"
                    stretch="aspectFill"
                    padding="3"
                    :class="poi.selected ? 'image selected' : 'image'"
                    placeholder="~/assets/images/placeholder.png"
                  ></CachedImage>
                  <CachedImage margin="3" verticalAlignment="top" horizontalAlignment="left" :source="getPoiIcon(poi)" row="0" col="0" height="20" width="20"></CachedImage>
                  <Label
                    v-if="poi.selected"
                    :text="'message.tapAgainForInfo' | L"
                    row="1"
                    col="0"
                    class="overlayLabel"
                    textWrap="true"
                    textAlignment="center"
                    verticalAlignment="middle"
                    horizontalAlignment="middle"
                  />
                </GridLayout>
              </CardView>
            </GridLayout>
          </v-template>
        </RadListView>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters } from "vuex";
import { keepAwake, allowSleepAgain } from "@nativescript-community/insomnia";
import * as utils from "~/plugins/utils";
import { firebase } from "@nativescript/firebase"
import { ListViewItemSnapMode } from "nativescript-ui-listview";
import debounce from "lodash/debounce";
import { ApplicationSettings, Utils } from "@nativescript/core";
import { isIOS, isAndroid } from "@nativescript/core";

export default {
  components: {
    GoogleMap
  },
  props: ["route", "activePoi", "calledFrom"],
  data() {
    return {
      scrollIndex: 0,
      scrollOffset: 0,
      width: 130,
      mapReady: false,
      selectedItem: null,
      dontResize: false,
      listPois: [],
      currentCategory: "all",
      ommenCenter: { position: { latitude: 52.4958, longitude: 6.44117 } },
      categories: ["all", "stolpersteine", "routes", "planes", "rest"],
      listviewLoaded: false
    };
  },
  beforeDestroy() {
    console.log("DESTROY");
    if (ApplicationSettings.getBoolean("screenOnWithMap")) {
      allowSleepAgain().then(function() {
        console.log("go to sleep little baby");
      });
    }
  },
  computed: {
    ...mapGetters({
      pois: "getPois",
      screenOrientation: "screenOrientation"
    }),
    padding() {
      if (this.screenOrientation === "landscape") {
        // left = scroll
        const rightPadding = isIOS
          ? 150
          : Utils.layout.toDevicePixels(160);
        // bottom = buttons
        const bottomPadding = isIOS
          ? 30
          : Utils.layout.toDevicePixels(30);

        return [0, bottomPadding, 0, rightPadding];
      } else {
        const bottomPadding = isIOS
          ? 170
          : Utils.layout.toDevicePixels(170);
        return [0, bottomPadding, 0, 0];
      }
    },
    verticalAlignment() {
      return this.screenOrientation === "landscape" ? "top" : "bottom";
    },

    horizontalAlignment() {
      return this.screenOrientation === "landscape" ? "right" : "middle";
    },
    marginBottomButtons() {
      return this.screenOrientation === "landscape" ? 5 : 140;
    },
    widthButtons() {
      return this.screenOrientation === "landscape" ? "100%" : "100%";
    },
    cardsContainerHeight() {
      return this.screenOrientation === "landscape" ? "100%" : 140;
    },
    cardsContainerWidth() {
      return this.screenOrientation === "landscape" ? 140 : "100%";
    },
    orientation() {
      return this.screenOrientation === "landscape" ? "vertical" : "horizontal";
    },
   
    // depending on what is showing, return paths for routes
    paths() {
      if (this.route) return [this.route.path];
      else {
        if (this.currentCategory === "all" || this.currentCategory === "routes")
          return this.$store.getters.getRoutes.map(route => route.path);
        else return [];
      }
    },
    showCategories() {
      return this.pageName === 'discover' && this.listPois.length > 0
    },
    pageName() {
      return this.route ? "route" : "discover";
    },
    getPoisForView() {
      if (this.route && this.route.pois) {
        let idx = 1;
        const pois = this.route.pois.map(poi => {
          // copy it (not sure if necessary?) and mark as route point, not regular point
          return Object.assign({ routePoint: true, routeIndex: idx++ }, poi);
        });
        pois[0].start = true; // for setting start icon... not pretty but hey it works

        return pois;
      } else if (this.pois) {
        // get all points without tag == 'aanwijzing'
        return this.pois.filter(p => {
          p.selected = false
          if (p.tags && p.tags.length) {
            for (let ti = 0; ti < p.tags.length; ti++) {
              // if we display points only, remove 'aanwijzing' points
              if (p.tags[ti].toLowerCase() === "aanwijzing") {
                return false;
              }
            }
          }
          return true;
        });
      }
    }
  },
  watch: {
    screenOrientation(oldVal, newVal) {
      // refresh the list to re-render properly
      console.log("Discover: screenOrientation changed", newVal);
      this.$nextTick(() => {
        if (this.$refs.listView) {
          this.$refs.listView.refresh();
        }
      });
    }
  },
  methods: {
    onLoaded() {
      this.mapReady = false;
      console.log("discover - onloaded");
      const curPage = {
        name: this.pageName,
        instance: this
      };
      if (this.pageName === "route") curPage.title = this.route.title;
      this.$store.commit("setCurrentPage", curPage);

      if (ApplicationSettings.getBoolean("screenOnWithMap")) {
        keepAwake().then(function() {
          console.log("Insomnia is active");
        });
      }
    },
    filterCategory(category) {
      console.log("filtering to category", category);
      this.currentCategory = category;
      // TODO filter function for listPois

      // idea: go over getPointsForView, check if they should be included in listPois, if so, check if they are there already
      // if not, push it in, otherwise leave as is.
      // then check rest of listPois array for items that should not be in there.

      this.getPoisForView.forEach(poi => {
        const shouldKeep = this.filterCategoryFn(poi);
        const idx = this.listPois.indexOf(poi);

        if (idx === -1) {
          if (shouldKeep) this.listPois.push(poi);
        } else {
          if (!shouldKeep) this.listPois.splice(idx, 1);
        }
      });

      this.$refs.gMap.addMapMarkers();
      // now fit map to points, all route points (including aanwijzingen, so whole route fits in screen)
      if (this.currentCategory === "routes") {
        let routePois = [];
        this.$store.getters.getRoutes.forEach(
          route => (routePois = routePois.concat(route.pois))
        );
        this.$refs.gMap.fitMapToPois(routePois);
      } else {
        this.$refs.gMap.fitMapToPois(this.listPois);
      }
    },
    filterCategoryFn(p) {
      if (this.currentCategory === "routes") {
        const routeStartPoints = this.$store.getters.getRoutesStartPois;
        return routeStartPoints.some(poi => poi.id === p.id);
      }
      if (this.currentCategory !== "all") {
        if (!p.tags || !Array.isArray(p.tags)) return false;

        switch (this.currentCategory) {
          case "rest":
            if (
              p.tags.some(
                t =>
                  t.toLowerCase() === "restaurant" || t.toLowerCase() === "cafe"
              )
            ) {
              return true;
            }
            break;
          case "planes":
            if (p.tags.some(t => t.toLowerCase() === "vliegtuig")) {
              return true;
            }
            break;
          case "stolpersteine":
            if (p.tags.some(t => t.toLowerCase() === "stolperstein")) {
              return true;
            }
          default:
            return false;
            break;
        }
      } else {
        return true;
      }
    },
    getPoiTitle(poi) {
      if (poi.routePoint) {
        return `${poi.routeIndex}. ${poi.title}`;
      }
      return poi.title;
    },
    getPoiImage(poi) {
      const imgs = poi.files.filter(file => file.type == "image");
      if (imgs.length > 0) {
        return imgs[0].firebaseUrl;
      }
    },
    getPoiIcon(poi) {
      const icon = utils.getPoiIcon(poi)
      return `~/assets/images/markers/${icon}@1.5x.png`
    },
    scrollToPoint(marker) {
      if (!marker || !marker.userData || !marker.userData.id) return;

      const l = this.listPois.length;
      let curPointIndex = 0;
      for (let idx = 0; idx < l; idx++) {
        const poi = this.listPois[idx];
        poi.selected = false;
        if (poi.id === marker.userData.id) {
          curPointIndex = idx;
        }
      }
      console.log(
        `scrolling to pois[${curPointIndex}]: ${marker.userData.title}`
      );
      this.$nextTick(() => {
        this.$refs.listView.scrollToIndex(
          curPointIndex,
          false,
          ListViewItemSnapMode.Center
        );
        this.$refs.listView.nativeView.selectItemAt(curPointIndex)

      });
    },
    showPointInfo(poi) {
      console.log("should load", poi.title);
      firebase.analytics
        .logEvent({
          key: "load_point",
          parameters: [
            // optional
            {
              key: "source",
              value: this.pageName
            },
            {
              key: "point_id",
              value: poi.id
            },
            {
              key: "point_name",
              value: poi.title
            }
          ]
        })
        .then(function() {
          console.log("analytics - logged load_point");
        });
      this.$myNavigateTo("pointinfo", {
        props: {
          point: poi,
          source: this.pageName
        }
      }).then(() => {
        console.log(" back to map from point");
        this.dontResize = true;
      });
    },
    onItemDeselecting({ index }) {
      if (isAndroid) return;
      console.log("itemDeselecting", index);
      this.selectedItem = null;
      const item = this.listPois[index];
      item.selected = false;
    },
    onItemDeselected({ index }) {
      if (isIOS) return;
      console.log("itemDeselected", index);
      this.selectedItem = null;
      const item = this.listPois[index];
      item.selected = false;
    },
    onItemSelected({ index }) {
      console.log("itemSelected", index);
      this.selectedItem = index;

      if (isIOS) this.listPois.forEach(poi => (poi.selected = false));

      const item = this.listPois[index];
      item.selected = true;
      this.$refs.gMap.showTitleForPoint(item);
      this.$refs.gMap.animateToPoint(
        item,
        50,
        Math.max(13, this.$store.getters.mapZoom)
      );
    },
    showPointInfoFromList(event) {
      if (this.selectedItem !== null) {
        if (this.selectedItem == event.index) {
          if (isIOS) this.$refs.listView.nativeView.deselectAll();

          this.selectedItem = null;
          if (isIOS) {
            setTimeout(() => {
              this.listPois[event.index].selected = false;
            }, 100);
          }
          console.log("should load:", event.item.title);
          this.showPointInfo(event.item);
        }
      }
    },
    zoomToMarkerByScroll(scrollOffset) {
      if (!this.$refs.listView) return;
      let newScrollIndex = this.$refs.listView.nativeView.getFirstVisiblePosition();
      if (newScrollIndex === 0) {
        newScrollIndex = 0;
        // except if it is scrolled a bit further, then select 1
        if (scrollOffset > 100) newScrollIndex = 1;
      } else newScrollIndex++;

      if (newScrollIndex === this.listPois.length - 1) {
        newScrollIndex = this.listPois.length - 1; // overflow issue
      }
      if (this.scrollIndex != newScrollIndex) {
        const activePoi = this.listPois[newScrollIndex];
        if (!activePoi) {
          console.error("could not determine active poi!");
          return;
        }
        console.log(` > to ${activePoi.title}`);
        this.$refs.gMap.showTitleForPoint(activePoi);
        this.$refs.gMap.animateToPoint(
          activePoi,
          50,
          Math.max(13, this.$store.getters.mapZoom)
        );
      }
      this.scrollIndex = newScrollIndex;
    },
    onScrolled({ scrollOffset }) {
      this.scrollOffset = scrollOffset;
      const debounced = debounce(this.zoomToMarkerByScroll, 500);
      debounced(scrollOffset);
    },
    refreshPoints() {
      this.$store.dispatch("updatePois");
    },
    distanceBetween(poi1, poi2) {
      var R = 6371.071; // Radius of the Earth in km
      var rlat1 = poi1.position.latitude * (Math.PI / 180); // Convert degrees to radians
      var rlat2 = poi2.position.latitude * (Math.PI / 180); // Convert degrees to radians
      var difflat = rlat2 - rlat1; // Radian difference (latitudes)
      var difflon =
        (poi2.position.longitude - poi1.position.longitude) * (Math.PI / 180); // Radian difference (longitudes)

      var d =
        2 *
        R *
        Math.asin(
          Math.sqrt(
            Math.sin(difflat / 2) * Math.sin(difflat / 2) +
              Math.cos(rlat1) *
                Math.cos(rlat2) *
                Math.sin(difflon / 2) *
                Math.sin(difflon / 2)
          )
        );
      return d;
    },
    distanceFromOmmen(poi1, poi2) {
      return (
        this.distanceBetween(poi2, this.ommenCenter) -
        this.distanceBetween(poi1, this.ommenCenter)
      );
    },
    onMapReady() {
      console.log("discover reports: mapready");
      this.listPois = this.getPoisForView;
      console.log(this.listPois.length)
      this.$refs.listView.refresh()
      setTimeout(() => {
        this.$refs.gMap.addMapMarkers()

        this.mapReady = true;
      }, 200)
      if (!this.dontResize) {
        console.log("resizing map");
        this.$refs.gMap.fitMapToPois(this.listPois);
      } else {
        console.log("no resizing, coming from point");
        this.dontResize = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.landscape .cardStyle {
  margin: 0 10 10 0;
}
.portrait .cardStyle {
  margin: 0 10 10 0;
}
.cardStyle {
  background-color: #fff;
  color: rgb(43, 43, 43);
}
.cardContent {
  font-weight: bold;
  font-size: 30;
}
.categoryButton {
  font-size: 14;
  height: 22;
  border-radius: 10;
  &.selected {
    background-color: #ccc;
  }
}
.overlayLabel {
  color: black;
}
.image {
  border-radius: 0 0 10 10;
  vertical-align: bottom;
  &.selected {
    opacity: 0.2;
  }
}
</style>
