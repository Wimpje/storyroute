<template>
  <StackLayout row="0" class="nt-drawer__content">
    <StackLayout class="nt-drawer__header">
      <Image
        src="~/assets/images/header.png"
        class="nt-drawer__header-image"
        width="100"
        height="100"
      />
      <Label :text="'drawer.title' | L" class="nt-drawer__header-brand"></Label>
    </StackLayout>
    <ListView for="item in pages" height="100%" rowHeight="60" ref="list">
      <v-template>
        <GridLayout
          columns="auto, *"
          rows="*"
          :class="'nt-drawer__list-item' + (currentPage.name === item.name ? ' -selected': '')"
          @tap="goToPage(item.name)"
        >
          <Label row="0" col="0" :text="iconFromCode(item.icon)" class="nt-icon fas m-y-auto"></Label>
          <Label row="0" col="1" :text="item.text | L" class="p-r-10 m-y-auto"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";

export default {
  data() {
    return {
      pages:[]
          };
  },
  computed: {
    ...mapGetters([ "pagesInSideDrawer", "currentPage"] )
  },
  mounted() {
    console.log('sidebar - ', this.pagesInSideDrawer)
    this.pages = this.pagesInSideDrawer
  },
  watch: {
    currentPage(newValue) {
      // for some reason the mapGetter is not reacting, working around with a watch...
      this.$refs.list.nativeView.refresh()
    }
  },
  methods: {
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    },
    goToPage(item) {
      firebase.analytics.logEvent({
        key: "drawer_nav",
        parameters: [ // optional
          {
            key: "to_page",
            value: item.name
          }
          ]
      }).then(
          function () {
            console.log("analytics - logged drawer_nav");
          }
      );
      this.$myNavigateTo(item);
      utils.closeDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
//@import "~@nativescript/theme/scss/variables/grey";

.nt-drawer__header-brand {
}
.nt-icon {
}
.-selected {
  background-color:pink;
}

.nt-drawer__header {
  background-color: white;
  color:black;
}

.listItem {
  color: white;
}
</style>
