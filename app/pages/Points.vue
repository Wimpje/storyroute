<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout>
      <GoogleMap mapId="points" :pois="pois" @markerSelect="showPointInfo"/>
    </StackLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import PointInfo from "~/pages/PointInfo.vue";

import { mapGetters, mapActions } from "vuex";
import * as utils from "~/plugins/utils";

export default {
  mounted() {
  },
  components: {
    GoogleMap
  },
  data() {
    return {  };
  },
  computed: {
    ...mapGetters({
      pois: "getPois"
    })
  },
  created() {},
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'points', instance: this })
    },
    showPointInfo(marker) {
      console.log("should load", marker.poi.title);
      this.$myNavigateTo('pointinfo', {
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
