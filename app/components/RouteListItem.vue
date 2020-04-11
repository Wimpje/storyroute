<template>
  <GridLayout rows="190, auto, auto" columns="*, 50">
    <CachedImage
      row="0"
      colSpan="2"
      class="routeImage m-b-10"
      stretch="aspectFill"
      :source="image"
      placeholder= "~/assets/images/placeholder.png"
    />
    <!-- check text overflow for small screensizes-->
    <Label row="1" col="0" :text="route.title" class="routeTitle" textWrap="true"></Label>
    <Label row="2" col="0"  :text="route.subtitle" class="routeSubTitle" textWrap="true"></Label>
    <CenterLabel
      row="1"
      rowSpan="2"
      col="1"
      :centerMethod="17"
      text.decode="&#xf061;"
      class="fas t-24"
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
      if (this.route && this.route.files) {
        const file = this.route.files.filter(
          file => file.type == "image"
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
//@import "~@nativescript/theme/scss/variables/grey";

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
  border-radius: 10;
}
.action {
  background-color: #ddd;
}

.routeTitle {
  font-size: 18;
  font-weight: bold;
  line-height:18;
}
.routeSubTitle  {
  font-size: 16;
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
