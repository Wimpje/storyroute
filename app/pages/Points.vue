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

export default {
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
