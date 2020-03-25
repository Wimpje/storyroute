<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
      <GridLayout height="100%" rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
        <CachedImage
          width="100%"
          class="image"
          marginBottom="10"
          stretch="aspectFill"
          :source="image"
          placeholder= "~/assets/images/route-placeholder.png"
          row="0"
        />
        <ScrollView  row="1">
          <GridLayout class="info" rows="auto, *">
            <Label row="0" :text="article.title" class="h1 name" textWrap="true"></Label>
            <Label row="1" ref="text" class="text" textWrap="true"></Label>
          </GridLayout>
        </ScrollView>
        
        <StackLayout class="actions" row="2">
          <Button class="-outline" :text="'close' | L" @tap="close"></Button>
        </StackLayout>
      </GridLayout>
     
  </Page>
</template>
<script>

import * as utils from "~/plugins/utils";
import { Directions }from "nativescript-directions"

export default {
  components: {  },
  mounted() {
  },
  props: ["article"],
  methods: {
    onLoaded(args) {
      this.$store.commit('setCurrentPage', {name: 'articleinfo', instance: this})

      console.log('loading article:', this.article.text)
      this.$refs.text.nativeView.formattedText = utils.createFormattedString(this.article.text)
    },
    webViewLoaded(webView) {
      const height = webView.url.split("#")[1];
      if (height) {
        console.log('setting height', height)
        webView.object.height = Number(height);
      }
    },
    openNavigationTo(){
      console.log('open maps application to go to:', this.point.title)
      let directions = new Directions();
      directions.available().then(avail => {
          if (avail) {
            directions.navigate({
              to: {
                lat: this.point.position.latitude,
                lng: this.point.position.longitude
              }
            }).then(
              function() {
                console.log("Maps app launched.");
              },
              function(error) {
                console.log(error);
              }
            );
          }
          else {
            this.$store.setMessage('No maps application found to open')
          }
      });
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    image() {
      if (this.point) {
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

.info {
  background-color: #489e9e9e;
}
.text {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 18;
}
.name {
  padding: 5 20 5 20;
}
</style>
