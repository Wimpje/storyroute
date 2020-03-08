<template>
  <StackLayout row="0" class="nt-drawer__content">
    <StackLayout class="nt-drawer__header">
      <Image
        src="~/assets/images/header.png"
        class="nt-drawer__header-image"
        width="100"
        height="100"
      />
      <Label text="75 jaar bevrijding - Ommen" class="nt-drawer__header-brand"></Label>
    </StackLayout>
    <ListView for="item in navItems" height="100%">
      <v-template>
        <GridLayout
          columns="auto, *"
          :class="'nt-drawer__list-item' + (selectedPage === item.text ? ' -selected': '')"
          @tap="goToPage(item)"
        >
          <Label col="0" :text="iconFromCode(item.icon)" class="nt-icon fas"></Label>
          <Label col="1" :text="item.text" class="h1 p-r-10"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
import { routes, routeInfo } from "~/router";

import * as utils from "~/plugins/utils";
import Routes from "~/pages/Routes";
import SelectedPageService from "~/plugins/selected-page-service";

export default {
  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      selectedPage => (this.selectedPage = selectedPage)
    );
  },
  data() {
    return {
      selectedPage: "",
      navItems: Object.values(routeInfo)
    };
  },
  methods: {
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    },
    goToPage(item) {
      console.log("Navigating to page:", item.text);
      /*this.$navigateTo(item.page, {
        clearHistory: true
      })
        .catch(err => {
          console.log("Error navigating to " + item.text, err);
        })
        .then(res => {
          SelectedPageService.getInstance().updateSelectedPage(item.text);
        });*/
      utils.navigateTo(this, item);
      utils.closeDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@nativescript/theme/scss/variables/grey";

.nt-drawer__header {
  background-color: white;
}

.listItem {
  color: white;
}
</style>
