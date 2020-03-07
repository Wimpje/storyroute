<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>
    <GridLayout>
      <GoogleMap :pois="pois" />
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
    SelectedPageService.getInstance().updateSelectedPage("points");
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
