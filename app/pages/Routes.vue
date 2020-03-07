<template>
  <Page class="page">
    <AppActionBar page="Routes"></AppActionBar>

    <StackLayout>
      <ListView
        height="100%"
        ref="routesListView"
        @itemTap="loadRoute"
        for="route in routes"
        rowHeight="215"
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
import RouteInfo from "~/components/RouteInfo";
import Route from "~/pages/Route";
import SelectedPageService from "~/plugins/selected-page-service";

export default {
  mounted() {
    // this feels hacky - improve
    SelectedPageService.getInstance().updateSelectedPage("routes");
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
    loadRoute(event) {
      console.log("should load", event.item.title);
      this.$navigateTo(RouteInfo, {
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
