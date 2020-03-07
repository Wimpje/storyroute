<template>
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
import { SlideInOnTopTransition } from "nativescript-ui-sidedrawer";

export default {
  data() {
    return {
      transition: new SlideInOnTopTransition()
    };
  },
  methods: {}
};
</script>

<style scoped lang="scss">
@import "~@nativescript/theme/scss/variables/grey";
</style>
