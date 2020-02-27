<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>
    <GridLayout>
      <Label text="Foobar"></Label>
    </GridLayout>
  </Page>
</template>

<script>
import routes from "~/router";
import * as application from "tns-core-modules/application";
import Routes from "~/pages/Routes.vue";
import Points from "~/pages/Points.vue";
import News from "~/pages/News.vue";

export default {
  components: {
    Points,
    Routes,
    News
  },
  computed: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
</style>
