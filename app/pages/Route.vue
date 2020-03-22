<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="*, 100">
      <!-- <Label row="0" rowSpan="2" width="100%" height="100%" class="mapPlaceholder"></Label> -->
      <GoogleMap row="0" rowSpan="2" :pois="this.route.pois" :path="this.route.path" @markerSelect="selectMarker" :currentPoi="currentPoi">
        
      </GoogleMap> 
      <RadListView row="1" class="points" ref="listView" 
                   for="(poi, index) in this.route.pois" 
                   @itemTap="openPoint"
                   @loaded="listLoaded"
                   itemHeight="50"
                   itemInsertAnimation="Fade" itemDeleteAnimation="Fade">
        <v-template>
          <GridLayout
            rows="*"
            columns="70, 0, *, 100"
            :key="poi.id"
            :id="poi.id"
            class="point"
          >
            <Button row="0" col="0" class="-rounded-lg pointIndex" :text="index + 1"></Button>
            <CenterLabel
              row="0"
              col="2"
              class="-rounded pointDescription"
              :text="poi.title"
              :centerMethod="16"
              autoWrap="true"
            ></CenterLabel>
            <Button col="3" class="pointButton" :text="'point.info' | L" @tap="getInfoFor(poi)"></Button>
          </GridLayout>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import CenterLabel from "~/components/CenterLabel.vue";
import { mapGetters, mapActions } from "vuex";
import { keepAwake, allowSleepAgain } from "nativescript-insomnia";

export default {
  mounted() {
  },
  props: ["route", "activePoi"],
  components: {
    GoogleMap,
    CenterLabel
  },
  data() {
    return {
      markers: [],
      currentPoi: null
    };
  },
  computed: {},
  created() {},
  beforeDestroy() {
    // TODO settings?
    allowSleepAgain().then(function() {
      console.log("Insomnia is inactive, good night!");
    })
  },
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'route', instance: this })
      // TODO settings?
      keepAwake().then(function() {
        console.log("Insomnia is active");
      })
    },
    openPoint({item, index}) {
      console.log('tapped poi', item, index)
      this.currentPoi = item
    },

    listLoaded (args) {
    
    },
    getInfoFor (poi) {},
    selectMarker (marker) { 
      const poi = marker.poi
      this.currentPoi = poi
      const idx = this.route.pois.findIndex(p => poi.id === p.id)
      if (idx > -1)
        this.$refs.listView.scrollToIndex(idx, true);
    },
    refreshPoints() {},

  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
.pushDown {
  height:10;
}
.index {
  horizontal-align: center;
}
.outside {
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 36%,
    rgba(0, 212, 255, 0) 100%
  );
}
.points {
}
.pointsContainer {
}
.point {
  margin: 5;
  color: black;
}
.pointDescription {
  padding: 5;
  line-height: 100%;
  width: 100%;
  height: 40;
}
.mapPlaceholder {
  background-color: green;
}
</style>
