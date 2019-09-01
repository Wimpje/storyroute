<template>
  <Page class="page" actionBarHidden="true">
    <StackLayout>
      <ListView for="route in routes" height="100">
        <v-template>
          <Label :text="route.title" @tap="loadRoute(route)" />
        </v-template>
      </ListView>
      <Button :text="'refresh routes' | L" @tap="refreshRoutes()" />
    </StackLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      routes: "getRoutes"
    })
  },
  methods: {
    loadRoute(item) {
      console.log("should load", item.title);
    },
    refreshRoutes() {
      this.$store.dispatch("initRoutes");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
