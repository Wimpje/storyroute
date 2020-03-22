<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="auto, *, auto">
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
      <Button row="2" text="back" @tap="goBack"/>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "@nativescript/core/utils/utils";
import * as myUtils from "~/plugins/utils";

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
      this.$store.commit('setCurrentPage', { name: 'news', instance: this })
      if(!this.news || this.news.length === 0) {
        this.loadNews()
      }
    },
    goBack() {
      this.$navigateBack()
    },
    toPrettyDate(date) {
      return moment(date).format("dddd, D MMMM YYYY, h:mm");
    },
    loadNews() {
      this.$store.dispatch('getArticles')
    },
    loadArticle(item) {
      this.currentItem = item;
      myUtils.navigateTo('articleinfo', {
        props: {
          article: item
        }
      }); 
    },
    openUrl(url) {
      utils.openUrl(item.url);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
