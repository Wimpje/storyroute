<template>
  <Page :class="screenOrientation" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*">
      <GoogleMap
        ref="gMap"
        row="0"
        :pois="poisToDisplay"
        :paths="paths"
        :padding="padding"
        @googleMapReady="onMapReady"
        @markerSelect="scrollToPoint"
      />

      <ScrollView row="0" v-if="pageName === 'discover'"
          verticalAlignment="bottom"
          :marginBottom="marginBottomButtons"
          :width="widthButtons"
          orientation="horizontal">
        <StackLayout orientation="horizontal">
            <Button v-for="category in categories" :key="category"
              :text="`discover.category.${category}` | L"
              @tap="filterCategory(category)"
              horizontalAlignment="center"
              verticalAlignment="middle"
              class="categoryButton m-x-4">
            </Button>
        </StackLayout>
      </ScrollView>

      <StackLayout row="0" 
        :width="cardsContainerWidth"
        :height="cardsContainerHeight"
        :verticalAlignment="verticalAlignment"
        :horizontalAlignment="horizontalAlignment">
        <RadListView for="(poi, index) in poisToDisplay"
          ref="listView"
          @loaded="listViewLoaded"
          :orientation="orientation"
          layout="linear"
          selectionBehavior="Press"
          :height="screenOrientation === 'landscape' ? '100%' : 150"
          :width="screenOrientation === 'landscape' ? 150 : '100%'"
          @scrollDragEnded="onScrolled"
          multipleSelection="false"
          @itemSelected="itemSelected"
          @itemDeselecting="itemDeselecting"
          @itemTap="showPointInfoFromList"
          >
          
          <v-template>
            <GridLayout>
            <CardView class="cardStyle" radius="10" height="110" width="130">
              <GridLayout rows="auto, 60" cols="auto" padding="2">
                <Label row="0" col="0" class="info" horizontalAlignment="center" verticalAlignment="top" textWrap="true">
                  <FormattedString>
                    <Span class="fas" text.decode="&#xf3c5; "/>
                    <Span :text="getPoiTitle(poi)" />
                  </FormattedString>
                </Label>
                 <CachedImage
                  verticalAlignment="bottom"
                  row="1"
                  col="0"
                  :source="getPoiImage(poi)" 
                  stretch="aspectFill"
                  padding="3"
                  :class="poi.selected ? 'image selected' : 'image'"
                  placeholder="~/assets/images/placeholder.png">
                </CachedImage>
                <Label row="1" v-if="poi.selected" :text="'discover.selectedPoiHint' | L"/>

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
import { keepAwake, allowSleepAgain } from "nativescript-insomnia";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";
import { ListViewItemSnapMode } from "nativescript-ui-listview";
import debounce from 'lodash/debounce';
import { getBoolean } from "tns-core-modules/application-settings";
import * as utilsModule from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from '@nativescript/core/ui/page/page';

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
      currentCategory: 'all',
      ommenCenter: {position: {latitude: 52.4958, longitude: 6.44117} },
      categories: ['all', 'stolpersteine', 'routes', 'planes', 'rest']
    };
  },
  mounted() {},
  beforeDestroy() {
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
      pois: "getPois",
      screenOrientation: "screenOrientation"
    }),
    padding() {
      if(this.screenOrientation === 'landscape') {
        // left = scroll
        const rightPadding = isIOS ? 160 : utilsModule.layout.toDevicePixels(160);
        // bottom = buttons
        const bottomPadding = isIOS ? 30 : utilsModule.layout.toDevicePixels(30);

        return [0, bottomPadding, 0, rightPadding];
      }
      else {
        const bottomPadding = isIOS ? 160 : utilsModule.layout.toDevicePixels(160);
        return [0, bottomPadding, 0, 0];
      }
    },
    verticalAlignment() {
      return this.screenOrientation === 'landscape' ? 'top' : 'bottom'
    },

    horizontalAlignment() {
      return this.screenOrientation === 'landscape' ? 'right' : 'middle'
    },
    marginBottomButtons() {
      return this.screenOrientation === 'landscape' ? 5 : 140
    },
    widthButtons() {
      return this.screenOrientation === 'landscape' ? '100%' : '100%'
    },
    cardsContainerHeight() {
      return this.screenOrientation === 'landscape' ? '100%' : 140
    },
    cardsContainerWidth() {
      return this.screenOrientation === 'landscape' ? 140 : '100%'
    },
    orientation() {
      return this.screenOrientation === 'landscape' ? 'vertical' : 'horizontal'
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
        let idx = 1;
        const pois = this.route.pois.map(poi => {
          // copy it (not sure if necessary?) and mark as route point, not regular point
          return Object.assign({routePoint: true, routeIndex: idx++}, poi)
        })
        pois[0].start = true // for setting start icon... not pretty but hey it works

        return pois
      }
      else if (this.pois) {
        if (this.currentCategory === 'routes') {
          return this.$store.getters.getRoutesStartPois
        }
        const filtered = this.pois.filter(p => {
          if (p.tags && p.tags.length) {
            for (let ti = 0; ti < p.tags.length; ti++) {
              // if we display points only, remove 'aanwijzing' points
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
                  case 'planes':
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
          // no tags, but a category is set, so filtering
          if (this.currentCategory === 'all') {
            return true
          }
          return false
        });
        // sort the points on distance so the map doesn't move around too much
        // filtered.sort(this.distanceFromOmmen);
        return filtered
      } else {
        return [];
      }
    }
  },
  created() {},
  watch: {
    poisToDisplay(newVal, oldVal) {
      if (this.pageName === 'route') {
        this.$refs.gMap.fitMapToPois(newVal)
      }
      else {
        if (this.currentCategory === 'routes') {
          let routePois = []
          this.$store.getters.getRoutes.forEach(route => routePois = routePois.concat(route.pois))
          this.$refs.gMap.fitMapToPois(routePois)
        }
        else {
          this.$refs.gMap.fitMapToPois(newVal)
        }
      }
    },
    screenOrientation(oldVal, newVal) {
      // refresh the list to re-render properly
      console.log('Discover: screenOrientation changed', newVal)
      this.$nextTick(() => {
        if (this.$refs.listView) {
          this.$refs.listView.refresh();
        }
      });
    }
  },
  methods: {
    onLoaded() {
      this.mapReady = false
      const curPage = { 
        name: this.pageName, 
        instance: this 
      }
      if (this.pageName === 'route') 
        curPage.title = this.route.title
      this.$store.commit("setCurrentPage", curPage);
      
      if(getBoolean('screenOnWithMap')) {
        keepAwake().then(function() {
          console.log("Insomnia is active");
        });
      }
    
    },
    listViewLoaded(args) {
      console.log('listview loaded event')
    },
    filterCategory(category) {
      console.log('filtering to category', category)
      this.currentCategory = category
      this.$nextTick(() => {
        if (this.$refs.listView) {
          this.$refs.listView.refresh();
        }
      });
    },
    getPoiTitle(poi) {
      if(poi.routePoint) {
        return `${poi.routeIndex}. ${poi.title}`
      }
      return poi.title
    },
    getPoiImage(poi) {
      const imgs =  poi.files.filter(file => file.type == "image");
      if(imgs.length > 0) {
        return imgs[0].firebaseUrl
      }
    },
    showPointInfoFromList(event) {
      if(!event.item.selected)
        return
      console.log("should load:", event.item.title);
      setTimeout(() => {
          this.showPointInfo(event.item)
      }, 100)      
    },
    scrollToPoint(marker) {
      if(!marker || !marker.userData || !marker.userData.id)
        return

      const idx = this.poisToDisplay.findIndex(p => marker.userData.id === p.id);
      console.log(`scrolling to pois[${idx}]: ${marker.userData.title}`)
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
    itemDeselecting({index}) {
      console.log('itemDeSelecting', index)
      this.$refs.listView.items[index].selected = false
      //this.$refs.listView.refresh() // to indicate to tap again
    },
    itemSelected({index}) {
      console.log('itemSelected', index)
      const activePoi = this.poisToDisplay[index]

      this.$refs.listView.items[index].selected = true
      //this.$refs.listView.refresh()
      this.$refs.gMap.showTitleForPoint(activePoi)
      this.$refs.gMap.animateToPoint(activePoi, 50, Math.min(12, this.$store.getters.mapZoom))
    },
    zoomToMarkerByScroll(scrollOffset) {
      let newScrollIndex = this.$refs.listView.nativeView.getFirstVisiblePosition()
      if (newScrollIndex === 0) {
        newScrollIndex = 0
        // except if it is scrolled a bit further, then select 1
        if(scrollOffset > 100 )
          newScrollIndex = 1
      }
      else 
        newScrollIndex++
      
      if(newScrollIndex === this.poisToDisplay.length - 1) {
        newScrollIndex = this.poisToDisplay.length - 1  // overflow issue
      }
      if (this.scrollIndex != newScrollIndex) {
        const activePoi = this.poisToDisplay[newScrollIndex]
        if (!activePoi) {
          console.error('could not determine active poi!')
          return
        }
        console.log(` > to ${activePoi.title}`)
        this.$refs.gMap.showTitleForPoint(activePoi)
        this.$refs.gMap.animateToPoint(activePoi, 50, Math.min(12, this.$store.getters.mapZoom))
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
      return this.distanceBetween(poi2, this.ommenCenter) - this.distanceBetween(poi1, this.ommenCenter)
    },
    onMapReady() {
      console.log('discover reports: mapready')
      this.mapReady = true
      // on map load fit points
      this.$refs.gMap.fitMapToPois(this.poisToDisplay)
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
}
.image {
  border-radius: 0 0 10 10;
  vertical-align: bottom;
  &.selected {
    opacity: 0.5;
  }
}
</style>
