<template>
  <Image
    row="0"
    ref="image"
    class="cachedImage"
    :src="source"
    @loaded="imageLoaded">
  </Image>
</template>

<script>
import { Cache } from "tns-core-modules/ui/image-cache";
import { fromFileSync, fromResource, fromNativeSource } from "tns-core-modules/image-source";

const cache = new Cache()
cache.maxRequests = 10;

export default {
  props: ["placeholder", "source"],
  data() {
    return {
      imageLoading: true,
      imageFailed: false,
    };
  },
  created() {
    cache.placeholder = fromFileSync(this.placeholder)
    
    console.log('creating img', this.source)
    if (this.source && this.source.indexOf('http') == 0) {
      this.getFromCache(this.source)
    }
    else {
      this.source = fromResource(this.source)
    }
  },
  methods: {
    getFromCache(imageURL) {
        cache.enableDownload()
        let image = cache.get(imageURL)
        if (image) {
          this.imageLoading = false
          this.source = fromNativeSource(image);
          console.log('from cache')
        } else {
            console.log('loading from URL')
            cache.push({
                key: imageURL,
                url: imageURL,
                completed: (image, key) => {
                    if (imageURL === key) {
                      this.imageLoading = false
                      this.source = fromNativeSource(image);
                      console.log('loaded, stored in cache')
                    }
                }
            })
        }
        cache.disableDownload();
    },
    imageLoaded(args) {
      console.log('image loaded!')
      this.imageLoading = false;
    }
  }
}
</script>

<style>

</style>
