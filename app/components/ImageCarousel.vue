<template>
  <Carousel ref="carousel" v-if="images" height="100%" width="100%" color="white" @pageChanged="pageChanged" android:indicatorAnimation="slide" indicatorColor="#fff" indicatorOffset="0, -10" showIndicator="true">
    <CarouselItem v-for="(item, i) in allImages" :key="i"  verticalAlignment="middle" @tap="imageTapped">
      <GridLayout rows="*, auto">
        <CachedImage
            row="0"
            width="100%"
            height="100%"
            class="image"
            stretch="aspectFill"
            :source="item.firebaseUrl"
            placeholder= "~/assets/images/route-placeholder.png"
          ></CachedImage>
          <Label row="1" :text="item.title" horizontalAlignment="center" color="black" height="30" />
      </GridLayout>
    </CarouselItem>
</Carousel>

</template>

<script>

export default {
  components: {
    
  },
  props: ['images'],
  watch: {
    // hack, according to demo of nativesccript-carousel on github
    async images(to) {
        await this.$nextTick()
        this.$refs.carousel.nativeView.refresh();
    },
  },
  computed: {
    allImages() {
      if (this.images.length === 0) {
        // dummy 
        return {firebaseUrl: '~/assets/images/route-placeholder.png'}
      }
      else {
        return this.images
      }
    }
  },
  methods: {
    pageChanged(p) {
      console.log('page changed yeah', p)
    },
    imageTapped(i) {
      console.log('tapped image', i)
    }
  }
}
</script>

<style>

</style>
