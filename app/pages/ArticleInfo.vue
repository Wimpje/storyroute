<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout height="100%" rows="150, *" columns="*" iosOverflowSafeArea="true">
      <CachedImage
        width="100%"
        class="image"
        marginBottom="10"
        stretch="aspectFill"
        :source="image"
        placeholder= "~/assets/images/placeholder.png"
        row="0"
      />
      <ScrollView  row="1">
        <GridLayout class="info" rows="auto, *, auto">
          <Label row="0" :text="article.title" class="h1 name" textWrap="true"></Label>
          <Label row="1" ref="text" class="text p-20" textWrap="true"></Label>
          <UrlContents row="2" class="p-20" :addDivider="true" :urls="article.urls"></UrlContents>
        </GridLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>
<script>

import * as utils from "~/plugins/utils";
import UrlContents from "~/components/UrlContents";

export default {
  components: { UrlContents },
 mounted() {
    this.$store.commit('setCurrentArticle', this.article)
  },
  destroy() {
    console.log("DESTROY poi")
    this.$store.commit('setCurrentArticle', null)
  },
  props: ["article"],
  methods: {
    onLoaded(args) {
      this.$store.commit('setCurrentPage', {name: 'articleinfo', title: this.article.title, instance: this})

      console.log('loading & formatting article')
      this.$refs.text.nativeView.formattedText = utils.createFormattedString(this.article.text)
    },
    webViewLoaded(webView) {
      const height = webView.url.split("#")[1];
      if (height) {
        console.log('setting height', height)
        webView.object.height = Number(height);
      }
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    image() {
      if (this.point && this.point.files) {
        const file = this.point.files.filter(file => file.type == 'image' && file.lead)
        if (file.length)
          return file[0].firebaseUrl;
      }
      return ''
    }
  },
  data() {
    return {

    };
  }
};
</script>
<style scoped>
.image {
  margin-bottom: 10;
}

.text {
  vertical-align: top;
  font-size: 18;
}
.name {
  padding: 5 20 5 20;
}
</style>
