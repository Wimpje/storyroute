<template>
  <Page class="page">
    <StackLayout>
      <Label text="Config"></Label>

      <Button @tap="$modal.close()" text="Close" />
      <!-- <StackLayout orientation="horizontal">
        <Switch checked="true" @checkedChange="toggleDark" />
        <Label :text="'Dark mode' | L"></Label>
      </StackLayout>-->
    </StackLayout>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import Theme from "@nativescript/theme";

export default {
  mounted() {
    this.$store.commit('setCurrentPage', 'news')
  },
  computed: {},
  methods: {
    toggleDark() {
      Theme.toggleMode(); // to toggle between the modes
    }
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
</style>
