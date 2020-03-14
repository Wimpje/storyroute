<template>
  <Page actionBarHidden="true">
    <GridLayout rows="*, auto">
      <StackLayout row="0">
        <Label text="content"></Label>
        <Frame id="main-content" ref="mainContentRef"></Frame>
      </StackLayout>
      <GridLayout columns="*,*.*">
        <Label column="0" text="Routes"></Label>
        <Label column="1" text="Kaart"></Label>
        <Label column="2" text="Nieuws"></Label>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { routes } from "~/router";
import * as application from "tns-core-modules/application";
import Routes from "~/pages/Routes.vue";
import Points from "~/pages/Points.vue";
import News from "~/pages/News.vue";
import SelectedPageService from "~/plugins/selected-page-service";

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
