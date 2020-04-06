<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <StackLayout height="100%" iosOverflowSafeArea="true">
      <ScrollView>
        <StackLayout>
          <ImageCarousel height="200" :images="images"></ImageCarousel>

          <GridLayout class="info" rows="auto, *, auto">
            <Label row="0" :text="article.title" class="h1 name" textWrap="true"></Label>
            <Label row="1" ref="text" class="text p-20" textWrap="true"></Label>
            <UrlContents row="2" class="p-20" :addDivider="true" :urls="article.urls"></UrlContents>
          </GridLayout>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>
<script>
import ImageCarousel from "~/components/ImageCarousel";

import * as utils from "~/plugins/utils";
import UrlContents from "~/components/UrlContents";

export default {
  components: { UrlContents, ImageCarousel },
  mounted() {
    this.$store.commit("setCurrentArticle", this.article);
  },
  beforeDestroy() {
    console.log("DESTROY poi");
    this.$store.commit("setCurrentArticle", null);
  },
  props: ["article"],
  methods: {
    onLoaded(args) {
      this.$store.commit("setCurrentPage", {
        name: "articleinfo",
        title: this.article.title,
        instance: this
      });

      console.log("loading & formatting article");
      this.$refs.text.nativeView.formattedText = utils.createFormattedString(
        this.article.text
      );
    },
    webViewLoaded(webView) {
      const height = webView.url.split("#")[1];
      if (height) {
        console.log("setting height", height);
        webView.object.height = Number(height);
      }
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    images() {
      if (this.article) {
        return this.article.files.filter(file => file.type == "image");
      }
      return [];
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.image {
  margin-bottom: 10;
}
.info {
  margin-top:10;
}
.text {
  vertical-align: top;
  font-size: 18;
}
.name {
  padding: 5 20 5 20;
}
</style>
