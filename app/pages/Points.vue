<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>
    <GridLayout>
      <GoogleMap :pois="pois" @markerSelect="showPointInfo"/>
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters, mapActions } from "vuex";


export default {
  mounted() {
    this.$store.commit('setCurrentPage', 'points')
  },
  components: {
    GoogleMap
  },
  data() {
    return {
      markers: []
    };
  },
  computed: {
    ...mapGetters({
      pois: "getPois"
    })
  },
  created() {},
  methods: {
    showPointInfo(marker) {
      console.log("should load", marker.poi.title);
      utils.navigateTo('pointinfo', {
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
