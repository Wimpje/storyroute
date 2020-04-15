<template>
<Page class="page" actionBarHidden="true" @loaded="onLoaded" >
    <GridLayout rows="*, auto">
      <CardView row="0" class="cardStyle" radius="10" >
        <GridLayout rows="auto, auto, *" cols="auto" padding="20">
          <Label
            row="0"
            col="0"
            class="info h2"
            horizontalAlignment="center"
            verticalAlignment="top"
            textWrap="true"
            :text="image.title"
            v-if="image.title"
          ></Label>
          <Label
            row="1"
            col="0"
            class="info"
            horizontalAlignment="center"
            verticalAlignment="bottom"
            textWrap="true"
            :text="'message.imageinfo' | L"
          ></Label>
          <GridLayout row="2" col="0"
            height="100%"
            
            @pan="onPan" @pinch="onPinch" @doubleTap="onDoubleTap">
            <CachedImage
              ref="image"
              :source="image.firebaseUrl"
              stretch="aspectFit"
              placeholder="~/assets/images/placeholder.png"
            ></CachedImage>
          </GridLayout>
        </GridLayout>
      </CardView>
      <Button row="1" width="100%" @tap="close" :text="'btn.close' | L" />
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "utils/utils";
import { layout } from 'utils/utils';
import { isIOS, isAndroid } from "@nativescript/core/ui/page/page";

// gesture support thanks to https://github.com/vakrilov/native-script-pan-scale-demo/
export default {
  props: ["image"],
  data() {
    return {
      states: ["unknown", "start", "change", "end"],
      item: null,      
      density: 0,
      prevDeltaX: 0,
      prevDeltaY: 0,
      startScale: 1
    }
  },
  methods: {
    close() {
      this.$myNavigateBack()
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "imageinfo", instance: this });
      this.item = this.$refs.image.nativeView
      this.density = utils.layout.getDisplayDensity()
      this.item.translateX = 0;
      this.item.translateY = 0;
      this.item.scaleX = 1;
      this.item.scaleY = 1;
    },
    onPan (args) {
      console.log("PAN[" + this.states[args.state] + "] deltaX: " + Math.round(args.deltaX) + " deltaY: " + Math.round(args.deltaY));

      if (args.state === 1) {
          this.prevDeltaX = 0;
          this.prevDeltaY = 0;
      }
      else if (args.state === 2) {
          this.item.translateX += args.deltaX - this.prevDeltaX;
          this.item.translateY += args.deltaY - this.prevDeltaY;

          this.prevDeltaX = args.deltaX;
          this.prevDeltaY = args.deltaY;
      }
    },
    onPinch(args) {
      console.log("PINCH[" + this.states[args.state] + "] scale: " + args.scale + " focusX: " + args.getFocusX() + " focusY: " + args.getFocusY());

      if (args.state === 1) {
          const newOriginX = args.getFocusX() - this.item.translateX;
          const newOriginY = args.getFocusY() - this.item.translateY;

          const oldOriginX = this.item.originX * layout.toDeviceIndependentPixels(this.item.getMeasuredWidth());
          const oldOriginY = this.item.originY * layout.toDeviceIndependentPixels(this.item.getMeasuredHeight());

          this.item.translateX += (oldOriginX - newOriginX) * (1 - this.item.scaleX);
          this.item.translateY += (oldOriginY - newOriginY) * (1 - this.item.scaleY);

          this.item.originX = newOriginX / layout.toDeviceIndependentPixels(this.item.getMeasuredWidth());
          this.item.originY = newOriginY / layout.toDeviceIndependentPixels(this.item.getMeasuredHeight());

          this.startScale = this.item.scaleX;
      }

      else if (args.scale && args.scale !== 1) {
          let newScale = this.startScale * args.scale;
          newScale = Math.min(8, newScale);
          newScale = Math.max(0.125, newScale);

          this.item.scaleX = newScale;
          this.item.scaleY = newScale;
      }
    },
    onDoubleTap(args) {
      console.log("DOUBLETAP");
      let scale = 1
      if (this.item.scaleX >= 0.95 && this.item.scaleX < 1.05) {
        scale = 2
      }
      else {
        scale = 1
      }

      this.item.animate({
          translate: { x: 0, y: 0 },
          scale: { x: scale, y: scale },
          curve: "easeOut",
          duration: 300
      }).then(function () {
            console.log('doubletap animation done')
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
