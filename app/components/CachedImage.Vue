<template>
  <NSImg
    ref="image"
    :src="image"
    :failureImageUri="noimageName"
    :placeholderImageUri="placeholder"
    :showProgressBar="showProgressBar"
    @finalImageSet="imageLoaded">
  </NSImg>
</template>

<script>
// TODO - store in filesystem for subsequent app loads ... 

export default {
  props: ["placeholder", "source", "noimage", "showProgressBar"],
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
        return this.noimageName
      }
    },
    noimageName() {
      if (this.noimage) {
        return this.noimage
      } 
      else {
        return "~/assets/images/noimage.png"
      }
    }
  },
  methods: {
    imageLoaded(args) {
      console.log('image loaded!', args, this.source)
      this.imageLoading = false;
      //this.$emit('image_loaded', args.object)
    }
  }
}
</script>

<style>

</style>
