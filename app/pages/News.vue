<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="auto, *">
      <Label row="0" :text="'nav.news' | L" class="h1 p-10"></Label>
      <ActivityIndicator row="1" verticalAlignment="center" :busy="news.length == 0" />
      <ListView row="1" v-if="news.length" for="item in news" height="100%">
        <v-template>
          <StackLayout @tap="loadArticle(item)">
            <Label height="50" class="h2" :text="item.title"></Label>
            <Label height="10" class="date" :text="toPrettyDate(item.publishDate)"></Label>
          </StackLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "@nativescript/core/utils/utils";
import { mapGetters } from "vuex";

const moment = require("moment");

export default {
  components: {
    
  },
  mounted() {
  },
  data() {
    return {
      currentItem: null
    };
  },
  computed: {
    ...mapGetters({
      news: "getNews"
    })
  },
  created() {
    this.currentItem = null;
  },
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage', 'news')
      if(!this.news || this.news.length === 0) {
        this.loadNews()
      }
    },
    toPrettyDate(date) {
      return moment(date).format("dddd, D MMMM YYYY, h:mm");
    },
    loadNews() {
      this.$store.dispatch('getArticles')
    },
    loadArticle(item) {
      this.currentItem = item;
      utils.navigateTo(this, 'articleinfo', {
        props: {
          article: item
        }
      });    },
    openUrl(url) {
      utils.openUrl(item.url);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
