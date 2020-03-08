<template>
  <Page class="page">
    <AppActionBar page="Route"></AppActionBar>
    <GridLayout rows="*, 250">
      <Label row="0" rowSpan="2" width="100%" height="100%" class="mapPlaceholder" />
      <!-- <GoogleMap :pois="this.route.pois"></GoogleMap> -->
      <Button @tap="goTo()" text="go"></Button>
      <ScrollView row="1" class="points" ref="points" @scroll="onScroll">
        <StackLayout class="pointsContainer" ref="pointsContainer">
          <Label height="150" class="empty"></Label>
          <GridLayout v-for="(poi, index) in this.route.pois"
            height="50" rows="*" columns="70, 0, *, 100" 
            :key="poi.id"
            :id="poi.id"
            class="point">
            <Button row="0" col="0" class="-rounded-lg" :text="index + 1"></Button>
            <Label row="0" col="2" class="pointElement" :text="poi.title" autoWrap="true"></Label>
            <Button col="3" class="-rounded-lg" text="info" @tap="getInfoFor(poi)"></button>
          </GridLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters, mapActions } from "vuex";
import SelectedPageService from "~/plugins/selected-page-service";

export default {
  mounted() {
    // this feels hacky - improve
    SelectedPageService.getInstance().updateSelectedPage("route");
  },
  props: ["route"],
  components: {
    GoogleMap
  },
  data() {
    return {
      markers: []
    };
  },
  computed: {},
  created() {},
  methods: {
    onScroll(args) {
      const scrollView = args.object;
      
      // now check all elements and set opacity if they are higher
      this.$refs.pointsContainer.nativeView.eachChild(n => {
        const pos = n.getLocationInWindow(this.$refs.pointsContainer.nativeView)
        console.log(pos.y)
        if(pos.y < 500) {
          n.opacity = 0.5
        }
        else {
          n.opacity = 1
        }

      })

    },
    getInfoFor(poi) {

    },
    goTo(id) {
      const scroller = this.$refs.points.nativeView;
      id = this.$refs.pointsContainer
      scroller.scrollToVerticalOffset(40)
    },
    refreshPoints() {}
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
.index {
  horizontal-align: center;
}
.points {
  background-color: yellow;
}
.pointsContainer {
  background-color: purple;
}
.point {
  margin: 5;
  
  color: black;
}
.pointElement {
  background-color: white;
  padding: 5;  
}
.mapPlaceholder {
  background-color: green;
}
</style>
