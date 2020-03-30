<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout>
      <ListView
        height="100%"
        ref="routesListView"
        @itemTap="loadRoute"
        for="route in routes"
        rowHeight="235"
      >
        <v-template>
          <RouteListItem :route="route"></RouteListItem>
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import RouteListItem from "~/components/RouteListItem";
import RouteInfo from "~/pages/RouteInfo";
import Route from "~/pages/Route";
import * as utils from "~/plugins/utils";
import * as firebase from "nativescript-plugin-firebase";

export default {
  mounted() {
  },
  components: {
    RouteListItem,
    RouteInfo
  },
  data() {
    return {
      cache: null
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      routes: "getRoutes"
    })
  },
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'routes', instance: this })
    },
    loadRoute(event) {
      console.log("should load", event.item.title);
      firebase.analytics.logEvent({
        key: "load_route",
        parameters: [ // optional
          {
            key: "route_id",
            value: event.item.id
          },
          {
            key: "route_name",
            value: event.item.title
          }]
      }).then(
          function () {
            console.log("analytics - logged load_route");
          }
      );

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
