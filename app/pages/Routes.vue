<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*">
      <LoadData row="0" :data="routes" @reload="reloadData"/>
        <ListView
        v-if="routes && routes.length > 0"
        row="0"
        ref="routesListView"
        @itemTap="loadRoute"
        for="route in routes"
        rowHeight="280"
      >
        <v-template>
          <RouteListItem :route="route"></RouteListItem>
        </v-template>
      </ListView>

    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import RouteListItem from "~/components/RouteListItem";
import LoadData from "~/components/LoadData";

import * as utils from "~/plugins/utils";
import { firebase } from "@nativescript/firebase-core"
import '@nativescript/firebase-analytics';


export default {
  mounted() {
  },
  components: {
    RouteListItem,
    LoadData
  },
  data() {
    return {
      
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      routes: "getRoutes"
    }),
  },
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'routes', instance: this })
    },
    reloadData() {
      this.refreshRoutes()
    },
    loadRoute(event) {
      console.log("should load", event.item.title);
      firebase().analytics().logEvent("load_route", {
        "route_id": event.item.id,
        "route_name": event.item.title
      });

      this.$myNavigateTo('routeinfo', {
        props: {
          route: event.item
        }
      });
    },
    refreshRoutes() {
      this.$store.dispatch("initRoutes");
    }
  }
};
</script>

<style scoped lang="scss">

</style>
