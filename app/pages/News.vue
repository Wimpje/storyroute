<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout>
      <ActivityIndicator
        verticalAlignment="center"
        horizontalAlignment="middle"
        :busy="news.length == 0"
      />
      <!-- fake tabview, implementation can be a bit nicer, but it works -->
      <GridLayout orientation="horizontal" width="100%" rows="*,*,*" height="30" class="tabView">
        <Label v-for="(category, idx) in categories" :row="idx" :text="category" @tap="toggleTab(category)" verticalAlignment="stretch" :class="tabActive == 'news' ? 'tab selected' : 'tab'"></Label>
      </GridLayout>

      <RadListView
        row="1"
        for="item in articles"
        height="100%"
        v-if="articles.length"
        @itemTap="loadArticle"
      
      >
        <v-template>
          <GridLayout class="article" columns="80, *" rows="auto, auto, *">
            <CachedImage
              col="0"
              rowspan="2"
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
              colspan="2"
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
import ArticleInfo from "~/pages/ArticleInfo.vue";
import { mapGetters } from "vuex";
import { ObservableArray } from "@nativescript/core/data/observable-array/observable-array";

const moment = require("moment");

export default {
  components: {},
  mounted() {},
  data() {
    return {
      tabActive: "news",
      currentItem: null
    };
  },
  computed: {
    ...mapGetters({
      categories: "getArticleCategories",
      news: "getNews",
      events: "getEvents",
      stories: "getStories"
    }),
    articles() {
      if(this.tabActive === "news") 
        return this.news
      if(this.tabActive === "event") 
        return this.events
      if(this.tabActive === "story") 
        return this.story
      return []
    }
  },
  created() {
    this.currentItem = null;
  },
  methods: {
    toggleTab(which) {
      this.tabActive = which;     
    },
    whichCategoryToShow(item) {
      return item.category === this.tabActive
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "news", instance: this });
      if (!this.news || this.news.length === 0) {
        this.loadArticles();
      }
    },
    getImageFromItem(item) {
      if (item && !item.files) return;
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
        return;
      });
    },
    loadArticles() {
      this.$store.dispatch("getArticles");
      console.log("news retrieved");
    },
    loadArticle({ item }) {
      this.currentItem = item;
      // do something based on category? maybe different page? for now no
      this.$myNavigateTo("articleinfo", {
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
.tab {
  background-color: #ddd;
  padding: 10;
  .selected {
    background-color: #ccc;
     font-weight: bold;
  }
}
</style>
