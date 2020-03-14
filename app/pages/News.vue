<template>
  <Page class="page" @loaded="loadNews()">
    <AppActionBar page="News"></AppActionBar>
    <GridLayout rows="auto, *">
      <Label row="0" :text="'nav.news' | L" class="h1 p-10"></Label>
      <ActivityIndicator row="1" verticalAlignment="center" :busy="newsArticles.length == 0" />
      <ListView row="1" v-if="newsArticles.length" for="item in newsArticles" height="100%">
        <v-template>
          <StackLayout @tap="loadArticle(item)">
            <Label height="50" class="h2" :text="item.title"></Label>
            <Label height="10" class="date" :text="toPrettyDate(item.date)"></Label>
          </StackLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import { NewsService } from "~/services/newsService";
import * as utils from "@nativescript/core/utils/utils";
import SelectedPageService from "~/plugins/selected-page-service";
const moment = require("moment");

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
    toPrettyDate(date) {
      return moment(date).format("dddd, D MMMM YYYY, h:mm");
    },
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
