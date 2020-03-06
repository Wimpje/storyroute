<template>
  <ActionBar class="action-bar">
    <NavigationButton text="back" android.systemIcon="ic_menu_back"></NavigationButton>
    <ActionItem
      position="left"
      icon="res://baseline_menu_24"
      @tap="onDrawerButtonTap"
      ios.position="right"
    ></ActionItem>
    <Label class="action-bar-title" :text="page"></Label>
  </ActionBar>
</template>

<script>
import * as utils from "~/plugins/utils";
import firebase from "nativescript-plugin-firebase";

export default {
  props: ["page"],
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    login() {
      firebase
        .login({
          type: firebase.LoginType.ANONYMOUS
        })
        .then(user => {
          //store.dispatch("getPois")
          console.log("getPois called from app start");
          //store.dispatch("initRoutes")
          console.log("initRoutes called from app start");
          console.log("User uid: " + user.uid);
        })
        .catch(error => {
          // TODO handle errors on connections
          console.log("Issue with logging in: " + error);
        });
    }
  }
};
</script>

<style>
</style>
