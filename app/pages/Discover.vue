<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*">
      <GoogleMap
        ref="gMap"
        row="0"
        :pois="poisToDisplay"
        :paths="paths"
        :padding="padding"
        @markerSelect="scrollToPoint"
        @cameraChanged="onCameraChanged" />

      <ScrollView row="0" v-if="pageName === 'discover'"
          verticalAlignment="bottom"
          marginBottom="120"
          orientation="horizontal">
        <StackLayout orientation="horizontal">
            <Button v-for="category in categories" :key="category"
              :text="`discover.category.${category}` | L"
              @tap="filterCategory(category)"
              horizontalAlignment="middle"
              verticalAlignment="middle"
              class="categoryButton m-l-4">
            </Button>
        </StackLayout>
      </ScrollView>

      <StackLayout row="0" height="110" verticalAlignment="bottom">
        <RadListView for="(poi, index) in poisToDisplay"
          ref="listView"
          orientation="horizontal"
          layout="grid"
          :itemWidth="width"
          :gridSpanCount="1"
          itemHeight="110"
          @scrollDragEnded="onScrolled"
          @itemTap="showPointInfoFromList">
          <v-template name="header">
            <CardView class="cardStyle" radius="10" height="100" width="130">
              <StackLayout>
                <Label class="info" horizontalAlignment="center" verticalAlignment="center" textWrap="true">
                  <FormattedString>
                    <Span class="fas" text.decode="&#xf3c5; "/>
                    <Span :text="'discover.headerText' | L" />
                  </FormattedString>
                </Label>
              </StackLayout>
            </CardView>
          </v-template>
          <v-template>
            <CardView class="cardStyle" radius="10" height="100" width="130">
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
            <CardView class="cardStyle" radius="10" height="100" width="130">
              <StackLayout>
                <Label class="info" horizontalAlignment="center" verticalAlignment="center" textWrap="true">
                  <FormattedString>
                    <Span class="fas" text.decode="&#xf3c5; "/>
                    <Span :text="'discover.footerText' | L" />
                  </FormattedString>
                </Label>
              </StackLayout>
            </CardView>
          </v-template>
        </RadListView>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters } from "vuex";
import { keepAwake, allowSleepAgain } from "nativescript-insomnia";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";
import { ListViewItemSnapMode } from "nativescript-ui-listview";
import debounce from 'lodash/debounce';
import { getBoolean } from "tns-core-modules/application-settings";
import * as utilsModule from "tns-core-modules/utils/utils";
import { isIOS } from '@nativescript/core/ui/page/page';

export default {
  components: {
    GoogleMap
  },
  props: ["route", "activePoi", "calledFrom"],
  data() {
    return {
      scrollIndex: 0,
      scrollOffset: 0,
      width: 140,
      currentCategory: 'all',
      ommenCenter: {position: {latitude: 52.4958, longitude: 6.44117} },
      categories: ['all', 'stolpersteine', 'routes', 'planes', 'rest']
    };
  },
  mounted() {},
  destroy() {
    console.log('DESTROY')

    this.$store.commit('setCurrentRoute', null)
    if(getBoolean('screenOnWithMap')) {
      allowSleepAgain().then(function() {
        console.log("Insomnia is inactive, good night!");
      });
    }
  },
  computed: {
    ...mapGetters({
      pois: "getPois"
    }),
    padding() {
      const bottomPadding = isIOS ? 170 : utilsModule.layout.toDevicePixels(170);
      return [0, bottomPadding, 0, 0];
    },
    // depending on what is showing, return paths for routes
    paths() {
      if(this.route)
        return [this.route.path]
      else {
        if(this.currentCategory === 'all' || this.currentCategory === 'routes') 
          return this.$store.getters.getRoutes.map(route => route.path)
        else 
          return []
      }
    },
    pageName() {
      return this.route ? 'route' : 'discover'
    },
    poisToDisplay() {
      // if we display a route, display everything
      if (this.route && this.route.pois) {
        const pois = this.route.pois.map(poi => {
          // copy it (not sure if necessary?) and mark as route point, not regular point
          return Object.assign({routePoint: true}, poi)
        })
        pois[0].start = true // for setting start icon... not pretty but hey it works

        return pois
      }
      else if (this.pois) {
        // if we display points only, remove 'aanwijzing' points
        const filtered = this.pois.filter(p => {
          if (p.tags && p.tags.length) {
            for (let ti = 0; ti < p.tags.length; ti++) {
              if (p.tags[ti].toLowerCase() === "aanwijzing") {
                return false;
              }
              else if(this.currentCategory !== 'all') {
                switch (this.currentCategory) {
                  case 'rest':
                    if (p.tags[ti].toLowerCase() === 'restaurant' || p.tags[ti].toLowerCase() === 'cafe') {
                      return true
                    }
                    break;
                  case 'airplanes':
                    if (p.tags[ti].toLowerCase() === 'vliegtuig') {
                      return true
                    }
                    break;
                  case 'stolpersteine':
                    if (p.tags[ti].toLowerCase() === 'stolperstein') {
                      return true
                    }
                  default:
                    return false
                    break;
                }
              }
              else {
                return true
              }
            }
          }
          return true;
        });
        // sort the points on distance so the map doesn't move around too much
        filtered.sort(this.distanceFromOmmen);
        return filtered
      } else {
        return [];
      }
    }
  },
  created() {},
  methods: {
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: this.pageName, instance: this });
      if(getBoolean('screenOnWithMap')) {
        keepAwake().then(function() {
          console.log("Insomnia is active");
        });
      }
    },
    filterCategory(category) {
      console.log('filtering to category', category)
      this.currentCategory = category
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
      if(!marker || !marker.userData || !marker.userData.id)
        return

      const idx = this.poisToDisplay.findIndex(p => marker.userData.id === p.id);
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
            value: this.pageName
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
          point: poi,
          source: this.pageName
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
    },
     distanceBetween(poi1, poi2) {
      var R = 6371.0710; // Radius of the Earth in km
      var rlat1 = poi1.position.latitude * (Math.PI/180); // Convert degrees to radians
      var rlat2 = poi2.position.latitude * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (poi2.position.longitude - poi1.position.longitude) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    },
    distanceFromOmmen(poi1, poi2) {
      return this.distanceBetween(poi1, this.ommenCenter) - this.distanceBetween(poi2, this.ommenCenter)
    },
  }
};
</script>

<style scoped lang="scss">
.cardStyle {
  background-color: #fff;
  color: rgb(43, 43, 43);
  margin: 0 10 0 0;
}

.cardContent {
  padding: 20;
  font-weight: bold;
  font-size: 30;

}
.categoryButton {
  font-size: 16;
  height: 22;
  border-radius: 10;
}
</style>
