<template>
  <StackLayout row="0" class="drawerHeader">
    <Image src="~/assets/images/header.png" class="sideLogo" width="100" height="100" />

    <ListView for="item in navItems">
      <v-template>
        <StackLayout @tap="goToPage(item)" orientation="horizontal" class="listItem">
          <Image :src="iconFromCode(item.icon)" class="fas t-24"></Image>
          <Label :text="item.text"></Label>
        </StackLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
import routes from "~/router";
import * as utils from "~/plugins/utils";
import Routes from "~/pages/Routes";
export default {
  data() {
    return {
      navItems: [
        { icon: "&#xf4d7;", text: "Home", page: routes.home },
        { icon: "&#xf4d7;", text: "Routes", page: routes.routes },
        { icon: "&#xf893;", text: "Kaart", page: routes.points },
        { icon: "&#xf4d7;", text: "News", page: routes.news },
        { icon: "&#xf4d7;", text: "Config", page: routes.config }
      ]
    };
  },
  methods: {
    iconFromCode: function(code) {
      return "font://" + String.fromCharCode(code);
    },
    goToPage(item) {
      console.log("Navigating to page:", item.text);
      this.$navigateTo(item.page).catch(err => {
        console.log("Error navigating to " + item.text, err);
      });
      utils.closeDrawer();
    }
  }
};
</script>

<style>
.listItem {
  color: white;
}
</style>
