<template>
  <Page class="page" @loaded="onLoaded">
    <AppActionBar></AppActionBar>
    <GridLayout rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
      <CachedImage
        width="100%"
        class="routeImage"
        marginBottom="10"
        stretch="aspectFill"
        :source="image"
        placeholder= "~/assets/images/route-placeholder.png"
        row="0"
      />
      <GridLayout class="routeInfo" row="1" columns="auto, auto, *" rows="auto, *">
        <Label col="0" row="0" :text="travelModeIcon" class="h2 travelMode fas"></Label>
        <Label col="1" row="0" :text="route.distance + 'km'" class="h3 distance"></Label>
        <Label col="2" row="0" :text="route.title" class="h1 routeName" textWrap="true"></Label>
        <Label col="0" colSpan="3" row="1" :text="route.description" class="body routeDescription" textWrap="true"></Label>
      </GridLayout>

      <StackLayout class="actions" row="2">
        <Button class="-outline" text="Start Route" @tap="startRoute"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>

import CachedImage from "~/components/CachedImage"
import * as utils from "~/plugins/utils";


export default {
  components: {
    CachedImage
  },
  props: ["route"],
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'routeinfo', instance: this })
    },
    startRoute() {
      utils.navigateTo('route', { props: { route: this.route } });
    },
    close() {
      this.$modal.close();
    },
    iconFromCode: function(code) {
      return String.fromCharCode(code);
    }
  },
  computed: {
    travelModeIcon() {
      if(this.route && this.route.travelMode) {
        switch (this.route.travelMode) {
          case "WALKING":
            return String.fromCharCode('0xf554')
          case "BIKING":
            return String.fromCharCode('0xf206')
          case "DRIVING":
            return String.fromCharCode('0xf1b9')
          default:
            return String.fromCharCode('0xf05a')
        }
      }
      return String.fromCharCode('0xf05a')
    },
    image() {
      if (this.route) {
        const file = this.route.files.filter(file => file.type == 'image' && file.lead)
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
.routeImage {
  margin-bottom: 10;
}
.travelMode {
  margin: 15 10 10 20;
}
.distance {
  margin: 15
}

.routeInfo {
  background-color: #489e9e9e;
}
.routeDescription {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 18;
}
.routeName {
  padding: 5 20 5 20;
}
</style>
