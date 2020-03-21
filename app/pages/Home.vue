<template>
  <Page actionBarHidden="true">
    <BottomNavigation class="bottomNavigation" @itemTap="onTap">
      <TabStrip>
        <TabStripItem>
          <Label :text="'nav.routes' | L"></Label>
          <Image src.decode="font://&#xf4d7;" class="fas t-24"></Image>
        </TabStripItem>
        <TabStripItem>
          <Label :text="'nav.points' | L"></Label>
          <Image src.decode="font://&#xf5a0;" stretch="none" class="fas t-24"></Image>
        </TabStripItem>
        <TabStripItem>
          <Label :text="'nav.news' | L"></Label>
          <Image src.decode="font://&#xf143;" stretch="none" class="fas t-24"></Image>
        </TabStripItem>
      </TabStrip>
      <TabContentItem>
        <Frame id="frameTab0">
          <Routes />
        </Frame>
      </TabContentItem>
      <TabContentItem>
        <Frame id="frameTab1">
          <Points />
        </Frame>
      </TabContentItem>
      <TabContentItem>
        <Frame id="frameTab2">
          <News />
        </Frame>
      </TabContentItem>
    </BottomNavigation>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import Routes from "~/pages/Routes.vue";
import Points from "~/pages/Points.vue";
import News from "~/pages/News.vue";

export default {
  components: {
    Points,
    Routes,
    News
  },
  computed: {},
  methods: {
    onTap(args) {
      console.log(args)
      this.$store.commit('bottomNavigatedTo', args.selectedIndex)
    }
  }
};
</script>

<style scoped lang="scss">
.bottomNavigation {
  padding-top: 20;
  color: red;
}
</style>
