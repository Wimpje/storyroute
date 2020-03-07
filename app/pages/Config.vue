<template>
  <Page class="page">
    <StackLayout>
      <Label text="Config"></Label>
      <Button @tap="$modal.close()" text="Close" />
    </StackLayout>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import SelectedPageService from "~/plugins/selected-page-service";

export default {
  mounted() {
    // this feels hacky - improve
    SelectedPageService.getInstance().updateSelectedPage("config");
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
