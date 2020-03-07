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
    <GridLayout row="1" class="routeItem" columns="*,100,100">
      <Label row="0" :text="route.title" class="routeName" textwrap="true"></Label>
      <Button column="1" class="-rounded action" @tap="startRoute" :text="'route.start' | L"></Button>
      <Button column="2" class="-rounded action" @tap="moreInfo" :text="'route.moreinfo' | L"></Button>
    </GridLayout>
  </GridLayout>
</template>
<script>
export default {
  props: ["route", "cache"],
  methods: {},
  computed: {
    moreInfo(event) {
      console.log("more info");
    },
    startRoute(event) {
      console.log("start route");
    },
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
<style scoped>
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
  color: #f00;
  font-size: 14;
  font-weight: bold;
  horizontal-align: center;
  vertical-align: center;
  margin: 5 0 15 0;
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
