<template>
  <GridLayout rows="160, 50">
    <NsImg
      row="0"
      height="150"
      width="100%"
      class="routeImage"
      marginBottom="10"
      stretch="aspectFill"
      :src="image"
      :placeholder-image-uri="placeholder"
      :failure-image-uri="placeholder"
    />
    <GridLayout row="1" class="routeItem" columns="*,100">
      <Label row="0" :text="route.title" class="routeName" textwrap="true"></Label>
      <Label column="1" text.decode="&#xf0a9;" class="fas fabButton" @tap="startRoute()"></Label>
    </GridLayout>
  </GridLayout>
</template>
<script>
export default {
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
    image: function() {
      if (this.route.leadImage) {
        return this.route.leadImage;
      } else return this.placeholder;
    }
  },
  data() {
    return {
      placeholder: "~/assets/images/route-placeholder.png"
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
  height: 100;
  width: 100;
  border-radius: 100;
  font-size: 18;
  padding: 10;
  horizontal-align: center;
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
.routeName {
  font-size: 18;
  font-weight: bold;
  horizontal-align: left;
  vertical-align: center;
  margin: 5 0 15 0;
}
.ns-dark .routeName {
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
