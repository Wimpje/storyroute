<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <StackLayout>
      <ActivityIndicator verticalAlignment="center" horizontalAlignment="middle" :busy="news.length == 0" />
      <RadListView
        row="1"
        for="item in allNews"
        height="100%"
        v-if="news.length"
        @itemTap="loadArticle"
      >
        <v-template>
          <GridLayout class="article" columns="80, *" rows="auto, auto, *">
            <CachedImage
              col="0"
              rowSpan="2"
              class="thumbNail img-rounded p-5"
              stretch="aspectFill"
              :source="getImageFromItem(item)"
              height="80"
              placeholder="~/assets/images/route-placeholder.png"
            />
            <Label col="1" row="0" class="h2 p-5" :text="item.title"></Label>
            <Label
              col="1"
              row="1"
              class="date"
              verticalAlignment="top"
              :text="toPrettyDate(item.publishDate)"
            ></Label>
            <Label
              col="0"
              colSpan="2"
              row="2"
              height="60"
              class="text p-5"
              verticalAlignment="top"
              textWrap="true"
              :text="item.text ? item.text.replace(/#/i, '') : ''"
            ></Label>
          </GridLayout>
        </v-template>
      </RadListView>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "@nativescript/core/utils/utils";
import * as myUtils from "~/plugins/utils";
import { isAndroid, isIOS } from "tns-core-modules/platform";

import { mapGetters } from "vuex";
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';

const moment = require("moment");

export default {
  components: {},
  mounted() {},
  data() {
    return {
      currentItem: null,
      allNews: new ObservableArray(this.news)
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

      if (file.length) return file[0].firebaseUrl;
      return "";
    },
    goBack() {
      this.$navigateBack();
    },
    toPrettyDate(date) {
      return moment(date).format("dddd, D MMMM YYYY, h:mm");
    },
    updateNews() {
      // apparently needed for ios race condition
      this.$nextTick(() => {
        this.$store.dispatch("updateArticles");
        return
      });
    },
    loadNews() {
      this.$store.dispatch("getArticles");
      console.log('news retrieved')
    },
    loadArticle({ item }) {
      console.log('item', item)
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
      if (isIOS) {
        args.object.ios.numberOfLines = 2;
      }
      if (isAndroid) {
        args.object.android.setMaxLines(2);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.thumbNail {
  border-radius: 5;
}
.article {
  
}
</style>
