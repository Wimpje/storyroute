<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="*">
      <LoadData :data="allArticles" @reload="reloadData" row="0" />
      <MDTabs selectedIndex="0" tabsPosition="top" row="0">

        <MDTabStrip>
            <MDTabStripItem  
                v-for="(category) in categories"
                :key="category">
              <Label :text="'article.'+category | L"></Label>
            </MDTabStripItem>
        </MDTabStrip>

        <MDTabContentItem v-for="(category) in categories"  :key="category">
            <GridLayout class="m-10">
              <RadListView for="item in articles[category]" height="100%" @itemTap="loadArticle">
                <v-template>
                  <GridLayout class="article" columns="80, *" rows="auto, auto, *">
                    <CachedImage
                      col="0"
                      rowSpan="2"
                      class="thumbNail img-rounded p-5"
                      stretch="aspectFill"
                      :source="getImageFromItem(item)"
                      height="80"
                      
                      placeholder="~/assets/images/placeholder.png"
                    />
                    <Label col="1" row="0" class="h2 p-5" :text="item.title" textWrap="true"></Label>
                    <Label
                      col="1"
                      row="1"
                      v-if="item.publishedDate && item.category === 'news'"
                      class="date"
                      verticalAlignment="top"
                      :text="toPrettyDate(item.publishedDate)"
                    ></Label>
                  
                    <Label
                      col="0"
                      colSpan="2"
                      row="2"
                      height="80"
                      class="text p-5"
                      verticalAlignment="top"
                      textWrap="true"
                      :text="item.text ? item.text.replace(/#/i, '') : ''"
                      @loaded="textLabelLoaded"
                    ></Label>
                  </GridLayout>
                </v-template>
              </RadListView>
            </GridLayout>
        </MDTabContentItem>
      </MDTabs>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "@nativescript/core/utils";
import * as myUtils from "~/plugins/utils";
import { isAndroid, isIOS } from "@nativescript/core/platform";

import LoadData from "~/components/LoadData";
import { mapGetters } from "vuex";
import { firebase } from "@nativescript/firebase-core"
import '@nativescript/firebase-analytics';

const moment = require("moment");

export default {
  components: {LoadData},
  mounted() {},
  data() {
    return {
      tabActive: "news",
      currentItem: null
    };
  },
  computed: {
    ...mapGetters({
      allArticles: "getArticles",
      categories: "getArticleCategories",
      news: "getNews",
      events: "getEvents",
      stories: "getStories"
    }),
    articles() {
     return {
       'news': this.news.sort(myUtils.compareValues('publishedDate', 'desc')),
       'event': this.events,
       'story': this.stories
     }
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
      this.loadArticles();
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
      });
    },
    loadArticles() {
      this.$store.dispatch("getArticles")
      console.log("news retrieved");
    },
    loadArticle({ item }) {
      this.currentItem = item;
      firebase().analytics().logEvent('load_article', {
        "article_cat": item.category,
        "article_id": item.id,
        "article_name": item.title
      })
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
        args.object.ios.numberOfLines = 4;
        args.object.ios.adjustsFontSizeToFitWidth = false;
        args.object.ios.lineBreakMode = NSLineBreakMode.ByTruncatingTail;

      }
      if (isAndroid) {
        args.object.android.setMaxLines(4);
        args.object.android.setEllipsize(android.text.TextUtils.TruncateAt.END);
      }
    },
    reloadData() {
      this.updateNews()
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
.tab {
  font-size: 20;
  &.selected {
    background-color: #ccc;
    font-weight: bold;
  }
}
</style>
