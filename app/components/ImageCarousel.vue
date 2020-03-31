<template>
  <GridLayout iosOverflowSafeArea="false" height="100%" width="100%">
    <Carousel
      ref="carousel"
      v-if="images"
      @pageChanged="pageChanged"
      android:indicatorAnimation="slide"
      indicatorColor="#ccc"
      indicatorColorUnselected="#ddd"
      indicatorOffset="0, -20"
      showIndicator="true"
    >
      <CarouselItem
        v-for="(item, i) in allImages"
        :key="i"
        @tap="imageTapped"
        verticalAlignment="bottom"
      >
        <GridLayout rows="*, auto" height="100%">
          <CachedImage
            row="0"
            width="100%"
            class="image"
            stretch="aspectFill"
            :source="item.firebaseUrl"
            verticalAlignment="bottom"
            placeholder="~/assets/images/placeholder.png"
          ></CachedImage>
          <Label
            row="0"
            v-if="item.title"
            :text="item.title"
            class="carouselLabel m-b-10 p-5"
            verticalAlignment="bottom"
            horizontalAlignment="center"
          />
        </GridLayout>
      </CarouselItem>
    </Carousel>
  </GridLayout>
</template>

<script>
export default {
  components: {},
  props: ["images"],
  watch: {
    // hack, according to demo of nativesccript-carousel on github
    async images(to) {
      await this.$nextTick();
      this.$refs.carousel.nativeView.refresh();
    }
  },
  computed: {
    allImages() {
      if (this.images.length === 0) {
        // dummy
        return { firebaseUrl: "~/assets/images/placeholder.png" };
      } else {
        return this.images;
      }
    }
  },
  methods: {
    pageChanged(p) {
      console.log("page changed yeah", p);
    },
    imageTapped(i) {
      console.log("tapped image", i);
    }
  }
};
</script>

<style lang="scss" scoped>
.carouselLabel {
  background-color: white;
  border-radius: 5;
  color: black;
}
</style>
