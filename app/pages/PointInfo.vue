<template>
  <Page class="page">
    <AppActionBar page="Point info"></AppActionBar>
    <GridLayout rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
      <CachedImage
        width="100%"
        class="image"
        marginBottom="10"
        stretch="aspectFill"
        :source="image"
        placeholder= "~/assets/images/route-placeholder.png"
        row="0"
      />
      <GridLayout class="info" row="1" rows="auto, *">
        <Label row="0" :text="point.title" class="h1 name" textWrap="true"></Label>
        <Label row="1" :text="point.description" class="body description" textWrap="true"></Label>
      </GridLayout>

      <StackLayout class="actions" row="2">
        <Button class="-outline" :text="'close' | L" @tap="close"></Button>
        <Button class="-outline" :text="'goto' | L" @tap="openNavigationTo"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>

import CachedImage from "~/components/CachedImage"
import * as utils from "~/plugins/utils";
import { Directions }from "nativescript-directions"

export default {
  components: {
    CachedImage
  },
  mounted() {
    this.$store.commit('setCurrentPage', 'pointinfo')
  },
  props: ["point"],
  methods: {
    openNavigationTo(){
      let directions = new Directions();
      directions.available().then(avail => {
          if (avail) {
            directions.navigate({
              to: {
                lat: point.position.latitude,
                lng: point.position.longitude
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
.description {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 18;
}
.name {
  padding: 5 20 5 20;
}
</style>
