<template lang="html">
  <RadSideDrawer ref="drawer" gesturesEnabled="true" drawerLocation="left">
    <StackLayout ~drawerContent class="drawer">
      <slot name="drawerContent"></slot>
    </StackLayout>
    <Frame ~mainContent>
      <slot name="mainContent"></slot>
    </Frame>
  </RadSideDrawer>
</template>

<script>
import { routes } from "~/router";

export default {
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.drawer {
  padding: 10;
  background-color: #333366;
}

.sideLogo {
  margin-bottom: 10;
}

.sideLabel {
  padding: 10;
}

.sideLightGrayLabel {
  background-color: #aaaaaa;
}
</style>
