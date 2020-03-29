<template>
  <ActionBar class="action-bar">
    <ActionItem :visibility="shouldShowBack ? 'visible' : 'collapsed'" position="left" icon="~/images/back.png" :text="'btn.backIos' | L" @tap="backButton"/>

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
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['currentPageText', 'currentIsTabView']),
    shouldShowBack: {
      get() {
        return !this.currentIsTabView
      }
    }
  },
  methods: {
    backButton() {
      this.$myNavigateBack()
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style>
</style>
