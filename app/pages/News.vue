<template>
  <Page class="page">
    <AppActionBar page="Home"></AppActionBar>

    <FlexBoxLayout flexDirection="column">
      <Label text="foobar"></Label>
      <ListView for="item in newsArticles" height="40%">
        <v-template>
          <Label height="50" :text="item.title" @tap="loadArticle(item)" />
        </v-template>
      </ListView>
      <Button height="50" :text="'Reload artikelen' | L" @tap="reloadArticles()" />
    </FlexBoxLayout>
  </Page>
</template>

<script>
import { NewsService } from "~/services/newsService";
import * as utils from "tns-core-modules/utils/utils";

const service = new NewsService();
export default {
  data() {
    return {
      newsArticles: [],
      currentItem: null
    };
  },
  created() {
    this.currentItem = null;
    service.getNews(true).then(articles => {
      this.newsArticles = articles;
    });
  },
  methods: {
    async reloadArticles() {
      this.newsArticles = await service.getNews(true);
    },
    loadArticle(item) {
      console.log("open native browser with URL", item.url);
      this.currentItem = item;
      utils.openUrl(item.url);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
