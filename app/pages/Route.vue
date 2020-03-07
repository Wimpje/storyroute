<template>
  <Page class="page">
    <AppActionBar page="Route"></AppActionBar>
    <GridLayout>
      <GoogleMap :pois="this.route.pois" />
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
    refreshPoints() {}
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
</style>
