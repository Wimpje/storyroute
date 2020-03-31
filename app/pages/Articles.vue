<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="50, *">
      <ActivityIndicator
        row="1"
        verticalAlignment="center"
        horizontalAlignment="middle"
        :busy="loading"
      />
      <!-- fake tabview, implementation can be a bit nicer, but it works -->
      <GridLayout row="0" width="100%" columns="*,*,*" height="50" class="tabView">
        <CenterLabel
          v-for="(category, idx) in categories"
          :key="category"
          :col="idx"
          height="50"
          :text="'article.'+category | L"
          class="tab"
          :class="tabActive === category ? 'selected' : ''"
          @tap="toggleTab(category)"
        ></CenterLabel>
      </GridLayout>

      <RadListView row="1" for="item in articles" height="100%" @itemTap="loadArticle">
        <v-template>
          <GridLayout class="article" columns="80, *" rows="auto, auto, *">
            <CachedImage
              col="0"
              rowSpan="2"
              class="thumbNail img-rounded p-5"
              stretch="aspectFill"
              :source="getImageFromItem(item)"
              height="80"
              textWrap="true"
              placeholder="~/assets/images/placeholder.png"
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
             <Label col="0"
              colSpan="2"
              row="2"
              height="60"
              class="overlay"
              ></Label>
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
import ArticleInfo from "~/pages/ArticleInfo.vue";
import { mapGetters } from "vuex";
import { ObservableArray } from "@nativescript/core/data/observable-array/observable-array";
import * as firebase from "nativescript-plugin-firebase";

const moment = require("moment");

export default {
  components: {},
  mounted() {},
  data() {
    return {
      tabActive: "news",
      currentItem: null,
      loading: false
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
        return this.stories
      return []
    }
  },
  created() {
    this.currentItem = null;
  },
  methods: {
    toggleTab(which) {
      console.log('toggle tab', which)
      this.tabActive = which;
    },
    whichCategoryToShow(item) {
      return item.category === this.tabActive
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "articles", instance: this });
      if (!this.articles || this.articles.length === 0) {
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
        try {
          this.loading = true
          this.$store.dispatch("updateArticles");
          this.loading = false
        }
        catch(e) {
          this.loading = false
        }
      });
    },
    loadArticles() {
      this.loading = true
      
      this.$store.dispatch("getArticles").then(() => {
        this.loading = false
      }).catch(err => {
        this.loading = false
      })

      console.log("news retrieved");
    },
    loadArticle({ item }) {
      this.currentItem = item;
      firebase.analytics.logEvent({
        key: "load_article",
        parameters: [ // optional
          {
            key: "article_cat",
            value: item.category
          },
          {
            key: "article_id",
            value: item.id
          },
          {
            key: "article_name",
            value: item.title
          }]
      }).then(
          function () {
            console.log("analytics - logged load_article");
          }
      );
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
.tabView {
  background-color: #ddd;
  
  color: black;
}
.overlay {
  background: linear-gradient(0deg, rgba(255,255,255,1) 18%, rgba(255,255,255,0) 65%);
}
.tab {
  font-size: 20;
  &.selected {
    background-color: #ccc;
    font-weight: bold;
  }
}
</style>
