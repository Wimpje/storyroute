<template>
  <GridLayout rows="160, auto, auto" columns="*, 50">
    <CachedImage
      row="0"
      colSpan="2"
      class="routeImage"
      stretch="aspectFill"
      :source="image"
      placeholder= "~/assets/images/route-placeholder.png"
    />
    <Label row="1" col="0" :text="route.title" class="routeTitle" textwrap="true"></Label>
    <Label row="2" col="0" :text="route.subtitle" class="routeSubTitle" textwrap="true"></Label>
    <CenterLabel
      row="1"
      rowSpan="2"
      col="1"
      :centerMethod="17"
      text.decode="&#xf0a9;"
      class="fas fabButton"
      @tap="startRoute()"
    ></CenterLabel>
  </GridLayout>
</template>
<script>
export default {
  components: {
  },
  props: ["route", "cache"],
  methods: {
    moreInfo(event) {
      console.log("more info");
    },
    startRoute(event) {
      console.log("start route");
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
  border-radius: 140;
  font-size: 18;

}
.ns-dark .fabButton {
  background-color: white;
  color: black;
}

.default-img {
  color: #d1cece5b;
}
.routeImage {
  margin:0;
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
