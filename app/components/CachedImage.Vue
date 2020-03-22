<template>
  <Image
    ref="image"
    class="cachedImage"
    :src="resolvedImage"
    @loaded="imageLoaded">
  </Image>
</template>

<script>
// TODO - store in filesystem for subsequent app loads ... 
import { Cache } from "tns-core-modules/ui/image-cache";
import { ImageSource, fromNativeSource } from "tns-core-modules/image-source";

const cache = new Cache()
cache.maxRequests = 10;

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
    cache.placeholder = ImageSource.fromFileSync(this.placeholder)
    if (this.source && this.source.indexOf('http') == 0) {
      console.log('img - URL >> trying cache:', this.source)
      this.getFromCache(this.source)
    }
    else if(this.source) {
      console.log('img - from file or resource:', this.source)
      this.resolvedImage = ImageSource.fromFileOrResourceSync(this.source)
    }
    else {
      console.log('img - loading placeholder, original src:', this.source)
      this.resolvedImage = cache.placeholder
    }
  },
  methods: {
    getFromCache(imageURL) {
        cache.enableDownload()
        let image = cache.get(imageURL)
        if (image) {
          this.imageLoading = false
          this.resolvedImage = new ImageSource(image);
          console.log('from cache') 
        } else {
            console.log('loading from URL')
            cache.push({
                key: imageURL,
                url: imageURL,
                completed: (image, key) => {
                    if (imageURL === key) {
                      this.imageLoading = false
                      this.resolvedImage = new ImageSource(image);
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
