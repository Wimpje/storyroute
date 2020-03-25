<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="auto, *">
      <Label row="0" :text="'nav.news' | L" class="h1 p-10"></Label>
      <ActivityIndicator row="1" verticalAlignment="center" :busy="news.length == 0" />
      <RadListView
        row="1"
        for="item in news"
        height="100%"
        v-if="news.length"
        pullToRefresh="true"
        @pullToRefreshInitiated="updateNews"
        itemHeight="100"
        @itemTap="loadArticle"
      >
        <v-template>
          <GridLayout columns="80, *" row="50, 20, 50">
            <CachedImage
              col="0"
              rowSpan="2"
              class="thumbNail"
              stretch="aspectFill"
              :source="getImageFromItem(item)"
              height="80"
              placeholder="~/assets/images/route-placeholder.png"
            />
            <Label col="1" row="0" class="h2" :text="item.title"></Label>
            <Label col="1" row="1" class="date" :text="toPrettyDate(item.publishDate)"></Label>
            <Label col="1" row="2" class="text" ref="desc" :text="item.text" @loaded="textLabelLoaded"></Label>
          </GridLayout>
        </v-template>
      </RadListView>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "@nativescript/core/utils/utils";
import * as myUtils from "~/plugins/utils";
import { isAndroid, isIOS } from "tns-core-modules/platform";

import { mapGetters } from "vuex";

const moment = require("moment");

export default {
  components: {},
  mounted() {},
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
      this.$store.commit("setCurrentPage", { name: "news", instance: this });
      if (!this.news || this.news.length === 0) {
        this.loadNews();
      }
    },
    getImageFromItem(item) {
      const file = item.files.filter(file => file.type == "image");

      if (file.length) 
        return file[0].firebaseUrl;
      return ''
    },
    goBack() {
      this.$navigateBack();
    },
    toPrettyDate(date) {
      return moment(date).format("dddd, D MMMM YYYY, h:mm");
    },
    updateNews() {
      // aooerenlty needed for ios race condition
      this.$nextTick(() => {
        this.$store.dispatch("updateArticles");
      });
    },
    loadNews() {
      this.$store.dispatch("getArticles");
    },
    loadArticle({ item }) {
      this.currentItem = item;
      myUtils.navigateTo("articleinfo", {
        props: {
          article: item
        }
      });
    },
    openUrl(url) {
      utils.openUrl(item.url);
    },
    textLabelLoaded(args) {
      if(isIOS) {
        args.object.ios.numberOfLines = 2
      }
      if(isAndroid) {
        args.object.android.setMaxLines(2);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.thumbNail {
  border-radius:5;
}
</style>
