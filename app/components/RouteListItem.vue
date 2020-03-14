<template>
  <GridLayout rows="160, 30, 20" columns="*,100">
    <CachedImage
      row="0"
      colSpan="2"
      height="150"
      width="100%"
      class="routeImage"
      marginBottom="10"
      stretch="aspectFill"
      :source="image"
      placeholder= "~/assets/images/route-placeholder.png"
    />
    <Label row="1" col="0" height="30" :text="route.title" class="routeTitle" textwrap="true"></Label>
    <Label row="2" col="0" height="20" :text="route.subtitle" class="routeSubTitle" textwrap="true"></Label>
    <Label
      row="1"
      rowSpan="2"
      col="1"
      @loaded="center"
      text.decode="&#xf0a9;"
      class="fas fabButton"
      @tap="startRoute()"
    ></Label>
  </GridLayout>
</template>
<script>
import CachedImage from '~/components/CachedImage'
export default {
  components: {
    CachedImage
  },
  props: ["route", "cache"],
  methods: {
    moreInfo(event) {
      console.log("more info");
    },
    startRoute(event) {
      console.log("start route");
    },
    center(args) {
      if (args.object.android) {
        args.object.android.setGravity(17);
      }
    }
  },
  computed: {
    image() {
      if (this.route) {
        const file = this.route.files.filter(
          file => file.type == "image" && file.lead
        );
        if (file.length) return file[0].firebaseUrl;
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
<style scoped lang="scss">
@import "~@nativescript/theme/scss/variables/grey";

.ns-light .fabButton {
  background-color: black;
  color: white;
}
.fabButton {
  height: 50;
  width: 50;
  border-radius: 100;
  font-size: 15;
  text-align: center;
  vertical-align: center;
}
.ns-dark .fabButton {
  background-color: white;
  color: black;
}

.default-img {
  color: #d1cece5b;
}
.routeImage {
  margin-bottom: 10;
}
.action {
  background-color: #ddd;
}
.routeSubTitle {
  font-size: 14;
}
.routeTitle {
  font-size: 18;
  font-weight: bold;
  horizontal-align: left;
  vertical-align: center;
  margin: 5 0 15 0;
}
.ns-dark .routeSubTitle {
  color: white;
}

.routeItemBackground {
  background-color: white;
  opacity: 0.5;
  width: 100%;
  height: 100%;
}

.routeItem {
  color: #bdbdbd;
}
</style>
