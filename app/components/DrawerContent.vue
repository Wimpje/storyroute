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
    <ListView for="item in pages" height="100%" rowHeight="60">
      <v-template>
        <GridLayout
          columns="auto, *"
          rows="*"
          :class="'nt-drawer__list-item' + (currentPage === item.text ? ' -selected': '')"
          @tap="goToPage(item)"
        >
          <Label row="0" col="0" :text="iconFromCode(item.icon)" class="nt-icon fas"></Label>
          <Label row="0" col="1" :text="item.text" class="p-r-10"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as utils from "~/plugins/utils";

export default {
  data() {
    return {
      pages:[]
    };
  },
  computed: {
    ...mapGetters([ "pagesInSideDrawer"] )
  },
  mounted() {
    console.log('sidebar - ', this.pagesInSideDrawer)
    this.pages = this.pagesInSideDrawer
  },
  methods: {
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    },
    goToPage(item) {
      utils.navigateTo(this, item);
      utils.closeDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@nativescript/theme/scss/variables/grey";

.nt-drawer__header-brand {
}
.nt-icon {
}

.nt-drawer__header {
  background-color: white;
}

.listItem {
  color: white;
}
</style>
