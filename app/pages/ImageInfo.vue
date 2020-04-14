<template>
<Page class="page" actionBarHidden="true" @loaded="onLoaded" >
    <GridLayout rows="*, auto" padding="20">
      <CardView row="0" class="cardStyle" radius="10" >
        <GridLayout rows="auto, *" cols="auto" padding="20">
          <Label
            row="0"
            col="0"
            class="info"
            horizontalAlignment="center"
            verticalAlignment="top"
            textWrap="true"
            :text="image.title"
            v-if="image.title"
          >
          </Label>
          <CachedImage
            row="1"
            col="0"
            :source="image.firebaseUrl"
            stretch="aspectFit"
            padding="3"
            placeholder="~/assets/images/placeholder.png"
          ></CachedImage>
        </GridLayout>
      </CardView>
      <Button row="1" width="100%" @tap="close" :text="'btn.close' | L" />
    </GridLayout>
  </Page>
</template>

<script>
export default {
  props: ["image"],
  methods: {
    close() {
      this.$myNavigateBack()
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "imageinfo", instance: this });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
