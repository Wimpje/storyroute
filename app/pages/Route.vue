<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>
    <GridLayout>
      <GoogleMap :pois="getPois(this.route)" />
    </GridLayout>
  </Page>
</template>

<script>
import GoogleMap from "~/components/GoogleMap.vue";
import { mapGetters, mapActions } from "vuex";

export default {
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
