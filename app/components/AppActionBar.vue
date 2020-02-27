<template>
  <ActionBar class="action-bar">
    <navigation-button
      position="right"
      ios.icon="res://baseline_menu_24pt"
      android.icon="res://baseline_menu_24"
      @tap="onDrawerButtonTap"
    ></navigation-button>
    <Label class="action-bar-title" :text="name"></Label>
  </ActionBar>
</template>

<script>
import * as utils from "~/plugins/utils";

export default {
  props: ["name"],
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style>
</style>
