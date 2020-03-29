<template>
  <Page>
    <AppActionBar></AppActionBar>
    <BottomNavigation class="bottomNavigation" @selectedIndexChanged="indexChanged">
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
          <Label :text="'nav.articles' | L"></Label>
          <Image src.decode="font://&#xf1ea;" stretch="none" class="fas t-24"></Image>
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
          <Articles />
        </Frame>
      </TabContentItem>
    </BottomNavigation>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import Routes from "~/pages/Routes.vue";
import Points from "~/pages/Points.vue";
import Articles from "~/pages/Articles.vue";
import * as utils from "~/plugins/utils";


export default {
  components: {
    Points,
    Routes,
    Articles
  },
  computed: {},
  methods: {
    indexChanged(args) {
      args.cancel = true
      // not awesome, but makes it in sync with how otherrs navigate, and builds navigation stack for android.
      let page = ''
      switch (args.object.selectedIndex) {
        case 0:
          page = 'routes'
          break;
        case 1:
          page = 'points'
          break;
        case 2:
          page = 'articles'
          break;
      }
      console.log('bottomnav', args.object.selectedIndex)
      // this.$myNavigateTo(page)
      this.$store.commit('bottomNavigatedTo', args.object.selectedIndex)
    }
  }
};
</script>

<style scoped lang="scss">

</style>
