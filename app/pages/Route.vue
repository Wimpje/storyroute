<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*, auto, 150">
      <GoogleMap
        ref="gMap" 
        row="0" 
        :pois="poisToDisplay"
        :path="route.path" 
        @markerSelect="scrollToPoint" />
      
      <RadListView for="(poi, index) in poisToDisplay"
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
          <CardView class="cardStyle" radius="10" height="140" :width="width">
            <StackLayout>
              <Label class="info" horizontalAlignment="center" verticalAlignment="center" textWrap="true">
                <FormattedString>
                  <Span class="fas" text.decode="&#xf3c5; "/>
                  <Span :text="(index + 1) + '. ' + poi.title" />
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
import { keepAwake, allowSleepAgain } from "nativescript-insomnia";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";
import { ListViewItemSnapMode } from "nativescript-ui-listview";
import debounce from 'lodash/debounce';

export default {
  components: {
    GoogleMap
  },
  props: ["route", "activePoi"],
  data() {
    return {
      scrollIndex: 0,
      scrollOffset: 0,
      width: 150
    };
  },
  computed: {
    poisToDisplay() {
      if(this.route && this.route.pois) {
        const pois = this.route.pois.map(poi => {
          // copy it (not sure if necessary?) and mark as route point, not regular point
          return Object.assign({routePoint: true}, poi)
        })
        pois[0].start = true // for setting start icon... not pretty but hey it works

        return pois
      }
      else {
        return []
      }
    }
  },
  mounted() {
    this.$store.commit('setCurrentRoute', this.route)
  },
  destroy() {
    console.log("DESTROY ROUTE")
    this.$store.commit('setCurrentRoute', null)
      // TODO settings?
    allowSleepAgain().then(function() {
      console.log("Insomnia is inactive, good night!");
    });
  },
  methods: {
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "route", title: this.route.title, instance: this });
      // TODO settings?
      keepAwake().then(function() {
        console.log("Insomnia is active");
      });
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
            value: "route"
          },
          {
            key: "from_route_id",
            value: this.route.id
          },
          {
            key: "from_route_title",
            value: this.route.title
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
        this.$refs.gMap.animateToPoint(activePoi, 40, 16)
      }
      this.scrollIndex = newScrollIndex
    },
    onScrolled ({ scrollOffset }) {
      this.scrollOffset = scrollOffset
      const debounced = debounce(this.zoomToMarkerByScroll, 500)
      debounced(scrollOffset)
    },
    refreshPoints() {}
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
    border:1;
    font-size: 30;
}
.mapPlaceholder {
  background-color: green;
}
</style>
