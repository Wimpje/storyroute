<template>
  <NSImg
    ref="image"
    :src="image"
    :failureImageUri="placeholder"
    :placeholderImageUri="placeholder"
    @loaded="imageLoaded">
  </NSImg>
</template>

<script>
// TODO - store in filesystem for subsequent app loads ... 
import { Cache } from "tns-core-modules/ui/image-cache";

export default {
  props: ["placeholder", "source"],
  data() {
    return {
      imageLoading: true,
      imageFailed: false,
      resolvedImage: ''
    };
  },
  created() {
    this.imageLoading = true;
  },
  computed: {
    image() {
      if (this.source) {
        return this.source
      } 
      else {
        return this.placeholder
      }
    }
  },
  methods: {
    imageLoaded(args) {
      console.log('image loaded!')
      this.imageLoading = false;
      //this.$emit('image_loaded', args.object)
    }
  }
}
</script>

<style>

</style>
