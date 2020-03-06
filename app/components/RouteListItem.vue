<template>
  <!-- TODO optimize, very nested layouts are slow they say -->
  <GridLayout rows="*" columns="*">
    <NsImg
      height="150"
      width="100%"
      class="routeImage"
      marginBottom="10"
      stretch="aspectFill"
      :src="image"
      :placeholder-image-uri="placeholder"
      :failure-image-uri="placeholder"
    />
    <GridLayout class="routeItem" verticalAlignment="bottom">
      <Label :text="route.title" class="routeName" textwrap="true"></Label>
      <Button @tap="startRoute" :text="'route.start' | L"></Button>
      <Button @tap="moreInfo" :text="'route.moreinfo' | L"></Button>
    </GridLayout>
  </GridLayout>
</template>
<script>
export default {
  props: ["route", "cache"],
  methods: {},
  computed: {
    moreInfo(event) {
      console.log('more info', event)
    },
    startRoute(event) {
      console.log('start route', event)
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
.routeName {
  color: #f00;
  font-size: 14;
  font-weight: bold;
  horizontal-align: center;
  vertical-align: center;
  margin: 5 0 15 0;
}

.routeItem {
  color: #bdbdbd;
}
</style>
