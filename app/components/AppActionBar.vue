<template>
  <ActionBar class="action-bar">
    <!-- <NavigationButton text="back" android.systemIcon="ic_menu_back"></NavigationButton> -->
    <ActionItem
      position="left"
      icon="res://baseline_menu_24"
      @tap="onDrawerButtonTap"
      ios.position="right"
    ></ActionItem>
    <Label class="action-bar-title" :text="currentPageText | L"></Label>
  </ActionBar>
</template>

<script>
import * as utils from "~/plugins/utils";
import firebase from "nativescript-plugin-firebase";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['currentPageText'])
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style>
</style>
