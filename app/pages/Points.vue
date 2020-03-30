<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout>
      <GoogleMap mapId="points" :pois="poisToDisplay" @markerSelect="showPointInfo" />
    </StackLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import PointInfo from "~/pages/PointInfo.vue";

import { mapGetters, mapActions } from "vuex";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";

export default {
  mounted() {},
  components: {
    GoogleMap
  },
  data() {
    return {};
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

    showPointInfo(marker) {
      console.log("should load", marker.poi.title);
      firebase.analytics.logEvent({
        key: "load_point",
        parameters: [ // optional
          {
            key: "source",
            value: "points"
          },
          {
            key: "point_id",
            value: marker.poi.id
          },
          {
            key: "point_name",
            value: marker.poi.title
          }]
      }).then(
          function () {
            console.log("analytics - logged load_point");
          }
      );
      this.$myNavigateTo("pointinfo", {
        props: {
          point: marker.poi
        }
      });
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
</style>
