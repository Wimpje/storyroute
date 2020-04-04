<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*, auto, 150">
      <GoogleMap
        ref="gMap"
        row="0"
        :pois="poisToDisplay" 
        @markerSelect="scrollToPoint"
        @cameraChanged="onCameraChanged" />

      <RadListView for="poi in poisToDisplay"
         row="2"
         height="150"
         ref="listView"
         orientation="horizontal"
         layout="linear"
         :itemWidth="width"
         itemHeight="150"
         @scrollDragEnded="onScrolled"
         @itemTap="showPointInfoFromList">
        <v-template name="header">
           <CardView class="cardStyle" radius="10" height="140" width="135">
            <StackLayout>
              <Label class="info" horizontalAlignment="center" verticalAlignment="center" textWrap="true">
                <FormattedString>
                  <Span class="fas" text.decode="&#xf3c5; "/>
                  <Span text="Swipe langs alle punten" />
                </FormattedString>
              </Label>
            </StackLayout>
          </CardView>
        </v-template>
        <v-template>
          <CardView class="cardStyle" radius="10" height="140" width="135">
            <StackLayout>
              <Label class="info" horizontalAlignment="center" verticalAlignment="center" textWrap="true">
                <FormattedString>
                  <Span class="fas" text.decode="&#xf3c5; "/>
                  <Span :text="poi.title" />
                </FormattedString>
              </Label>
              <CachedImage
                :source="getPoiImage(poi)" 
                stretch="aspectFit"
                placeholder="~/assets/images/placeholder.png"
                height="100"/>
            </StackLayout>
          </CardView>
        </v-template>
        <v-template name="footer">
          <!-- buffer -->
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters } from "vuex";

import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";
import { ListViewItemSnapMode } from "nativescript-ui-listview";
import debounce from 'lodash/debounce';

export default {
  mounted() {},
  components: {
    GoogleMap
  },
  data() {
    return {
      scrollIndex: 0,
      scrollOffset: 0,
      width: 150
    };
  },
  computed: {
    ...mapGetters({
      pois: "getPois"
    }),
    poisToDisplay() {
      if (this.pois) {
        return this.pois.filter(p => {
          if (p.tags && p.tags.length) {
            for (let ti = 0; ti < p.tags.length; ti++) {
              if (p.tags[ti].toLowerCase() === "aanwijzing") {
                console.log(
                  "found aanwijzing point, not showing: ",
                  p.title,
                  p.id
                );
                return false;
              }
            }
          }
          return true;
        });
      } else {
        return [];
      }
    }
  },
  created() {},
  methods: {
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "discover", instance: this });
    },
    getPoiImage(poi) {
      const imgs =  poi.files.filter(file => file.type == "image");
      if(imgs.length > 0) {
        return imgs[0].firebaseUrl
      }
    },
    showPointInfoFromList(event) {
      console.log("should load", event.item.title);
      setTimeout(() => {
          this.showPointInfo(event.item)
      }, 100)
    },
    onCameraChanged(args) {
      console.log('Camera changed: ' + JSON.stringify(args.camera)); 
    },
    scrollToPoint(marker) {
      if(!marker || !marker.poi)
        return

      const idx = this.poisToDisplay.findIndex(p => marker.poi.id === p.id);
      this.$nextTick(() => {
        this.$refs.listView.scrollToIndex(idx, false, ListViewItemSnapMode.Center); 
      })
    },
    showPointInfo(poi) {
      console.log("should load", poi.title);
      firebase.analytics.logEvent({
        key: "load_point",
        parameters: [ // optional
          {
            key: "source",
            value: "discover"
          },
          {
            key: "point_id",
            value: poi.id
          },
          {
            key: "point_name",
            value: poi.title
          }]
      }).then(
          function () {
            console.log("analytics - logged load_point");
          }
      );
      this.$myNavigateTo("pointinfo", {
        props: {
          point: poi
        }
      });
    },
    zoomToMarkerByScroll(scrollOffset) {
      console.log('zoom', scrollOffset)
      const newScrollIndex = Math.round(this.scrollOffset / this.width)
      if (this.scrollIndex != newScrollIndex) {
        const activePoi = this.poisToDisplay[newScrollIndex]
        this.$refs.gMap.showTitleForPoint(activePoi)
        this.$refs.gMap.animateToPoint(activePoi, 200, 13)
      }
      this.scrollIndex = newScrollIndex
    },
    onScrolled ({ scrollOffset }) {
      this.scrollOffset = scrollOffset
      const debounced = debounce(this.zoomToMarkerByScroll, 500)
      debounced(scrollOffset)

    },
    refreshPoints() {
      this.$store.dispatch("updatePois");
    }
  }
};
</script>

<style scoped lang="scss">
.cardStyle {
    background-color: #fff;
    color: rgb(43, 43, 43);
    margin: 3 10 3 5;
}

.cardContent {
    padding: 20;
    font-weight: bold;
    font-size: 30;
}
</style>
