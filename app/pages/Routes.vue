<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>

    <StackLayout>
      <ListView ref="routesListView" for="route in routes" height="90%">
        <v-template>
          <RouteListItem :route="route" @onTapped="loadRoute(route)"></RouteListItem>
        </v-template>
      </ListView>
      <Button class="-outline" :text="'refresh routes' | L" @tap="refreshRoutes()" />
    </StackLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import RouteListItem from "~/components/RouteListItem";
import RouteInfoModal from "~/components/RouteInfoModal";
import Route from "~/pages/Route";

export default {
  components: {
    RouteListItem,
    RouteInfoModal
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
    loadRoute(item) {
      console.log("should load", item.title);
      this.$showModal(RouteInfoModal, { props: { route: item } }).then(
        result => {
          if (result) {
            console.log("start route");
            this.$navigateTo(Route, { props: route }).catch(err =>
              console.log("error navigating to route + ", err)
            );
          } else {
            console.log("closed route");
          }
        }
      );
    },
    refreshRoutes() {
      this.$store.dispatch("initRoutes");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
