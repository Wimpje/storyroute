<template lang="html">
<Page>
    <AppActionBar page="Home"></AppActionBar>
    <StackLayout>
      <BottomNavigation>
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
          <Frame>
            <Routes />
          </Frame>
        </TabContentItem>
        <TabContentItem>
          <Frame>
            <Points />
          </Frame>
        </TabContentItem>
        <TabContentItem>
          <Frame>
            <News />
          </Frame>
        </TabContentItem>
      </BottomNavigation>
    </StackLayout>
  </Page>
</template>

<script>
import routes from "~/router";
import News from "~/pages/News";
import Points from "~/pages/Points";
import Routes from "~/pages/Routes";

export default {
  components: {
    Routes,
    News,
    Points
  },
  data() {
    return {};
  },
  created() {},
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
