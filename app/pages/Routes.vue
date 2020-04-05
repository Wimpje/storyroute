<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout>
      <ActivityIndicator :busy="showLoading"
        verticalAlignment="middle"
        horizontalAlignment="middle" />
      <Label class="warning" verticalAlignment="middle" horizontalAlignment="middle" v-if="loadingTrouble">
        <FormattedString>
          <Span class="fas" text.decode="&#xf35d; "/>
          <Span :text="'help.loadingTrouble' | L" class="title" />
        </FormattedString>
      </Label>
      <ListView
        height="100%"
        ref="routesListView"
        @itemTap="loadRoute"
        for="route in routes"
        rowHeight="265"
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
      cache: null,
      showLoading: false,
      loadingTrouble: false
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      routes: "getRoutes"
    }),
  },
  watch: {
    routes(oldVal, newVal) {
      if(newVal && newVal.length > 0) {
        this.loadingTrouble = false
        this.showLoading = false
      }
    }
  },
  methods: {
    onLoaded() {
      if(this.routes && this.routes.length === 0)
        this.showLoading = true

      this.$store.commit('setCurrentPage',  { name: 'routes', instance: this })
      // 
      setTimeout(() => {
        if(!this.routes || this.routes.length === 0) {
          this.loadingTrouble = true
          this.showLoading = false
        }
      }, 10000)
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
