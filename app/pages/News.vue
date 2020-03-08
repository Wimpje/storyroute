<template>
  <Page class="page" @loaded="loadNews()">
    <AppActionBar page="News"></AppActionBar>
    <StackLayout>
      <Label text="Nieuws" class="h1"></Label>
      <ActivityIndicator verticalAlignment="center" :busy="newsArticles.length == 0" />

      <ListView v-if="newsArticles.length" for="item in newsArticles" height="100%">
        <v-template>
          <StackLayout @tap="loadArticle(item)">
            <Label height="50" class="h2" :text="item.title"></Label>
            <Label height="10" class="date" :text="item.date"></Label>
          </StackLayout>
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script>
import { NewsService } from "~/services/newsService";
import * as utils from "@nativescript/core/utils/utils";
import SelectedPageService from "~/plugins/selected-page-service";

const service = new NewsService();

export default {
  mounted() {
    // this feels hacky - improve
    SelectedPageService.getInstance().updateSelectedPage("news");
  },
  data() {
    return {
      newsArticles: [],
      currentItem: null
    };
  },
  created() {
    this.currentItem = null;
  },
  methods: {
    loadNews() {
      service.getNews(true).then(n => {
        this.newsArticles = n;
      });
    },
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
