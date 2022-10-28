<template>
  <Page>
    <AppActionBar></AppActionBar>
    <MDBottomNavigation id="bottomNavigation" class="bottomNavigation" @selectedIndexChanged="indexChanged">
      <MDTabStrip>
        <MDTabStripItem>
          <Label :text="'nav.routes' | L"></Label>
          <Image src.decode="font://&#xf4d7;" class="fas t-24"></Image>
        </MDTabStripItem>
        <MDTabStripItem>
          <Label :text="'nav.discover' | L"></Label>
          <Image src.decode="font://&#xf06e;" stretch="none" class="fas t-24"></Image>
        </MDTabStripItem>
        <MDTabStripItem>
          <Label :text="'nav.articles' | L"></Label>
          <Image src.decode="font://&#xf1ea;" stretch="none" class="far t-24"></Image>
        </MDTabStripItem>
      </MDTabStrip>
      <MDTabContentItem>
        <Frame id="frameTab0">
          <Routes />
        </Frame>
      </MDTabContentItem>
      <MDTabContentItem>
        <Frame id="frameTab1">
          <Discover />
        </Frame>
      </MDTabContentItem>
      <MDTabContentItem>
        <Frame id="frameTab2">
          <Articles />
        </Frame>
      </MDTabContentItem>
    </MDBottomNavigation>
  </Page>
</template>

<script>
import Routes from "~/pages/Routes.vue";
import Discover from "~/pages/Discover.vue";
import Articles from "~/pages/Articles.vue";


export default {
  components: {
    Discover,
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
          page = 'discover'
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
