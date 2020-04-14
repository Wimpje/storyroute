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
      :showIndicator="allImages.length > 1"
    >
      <CarouselItem
        v-for="(item, i) in allImages"
        :key="i"
        verticalAlignment="bottom"
      >
        <GridLayout rows="*, auto" height="100%" @tap="imageTapped(item)">
          <CachedImage
            row="0"
            width="100%"
            class="image"
            :stretch="imageStretchMode"
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
import * as utils from "~/plugins/utils"
import ImageInfo from "~/pages/ImageInfo.vue"

export default {
  components: {
  },
  props: ["images", "stretch", "disableModal"],
  watch: {
    // hack, according to demo of nativesccript-carousel on github
    async images(to) {
      await this.$nextTick();
      this.$refs.carousel.nativeView.refresh();
    }
  },
  computed: {
    imageStretchMode() {
      if (this.stretch) 
        return this.stretch
      else 
        return 'aspectFill'
    },
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
      if(!this.disableModal) {
        this.$myNavigateTo("imageinfo", {
          props: {
            image: i
          }
        })
      }
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
