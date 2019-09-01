<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" :text="'app.name' | L"></Label>
    </ActionBar>

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
    goTo(page) {
      this.$navigateTo(routes[page], {
        clearHistory: true,
        transition: {
          name: "fade"
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
</style>
