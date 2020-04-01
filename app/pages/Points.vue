<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*, auto, 150">
      <GoogleMap mapId="points" ref="gMap" row="0" :pois="poisToDisplay" @markerSelect="scrollToPoint" />
      <RadListView for="poi in poisToDisplay"
         row="2"
         height="150"
         ref="listView"
         orientation="horizontal"
         :itemWidth="width"
         @scrolled="onScrolled"
         @itemTap="showPointInfoFromList">
        <v-template>
          <CardView class="cardStyle" radius="5" height="140" :width="width">
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
              <Button :text="'point.info' | L" />
            </StackLayout>
          </CardView>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import PointInfo from "~/pages/PointInfo.vue";

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
      this.$store.commit("setCurrentPage", { name: "points", instance: this });
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
    scrollToPoint(marker) {
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
            value: "points"
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
        // this.$refs.gMap.animateToPoint(activePoi, 200)
      }
      this.scrollIndex = newScrollIndex
    },
    onScrolled ({ scrollOffset }) {
      this.scrollOffset = scrollOffset
      const debounced = debounce(this.zoomToMarkerByScroll, 200)
      debounced(scrollOffset)

    },
    refreshPoints() {
      this.$store.dispatch("updatePois");
    }
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
.cardStyle {
    background-color: #fff;
    color: rgb(43, 43, 43);
    border-width: 1;
    margin: 3 10 3 5;
}

.cardContent {
    padding: 20;
    font-weight: bold;
    font-size: 30;
}
</style>
