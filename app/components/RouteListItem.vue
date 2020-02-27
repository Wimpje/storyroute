<template>
  <!-- TODO optimize, very nested layouts are slow they say -->
  <GridLayout rows="*" columns="*" @tap="onTapped">
    <Image
      height="150"
      width="100%"
      class="routeImage"
      marginBottom="10"
      stretch="aspectFill"
      :src="image"
    />
    <GridLayout verticalAlignment="bottom">
      <StackLayout class="routeItem" backgroundColor="#489e9e9e">
        <Label :text="route.title" class="routeName" textwrap="true"></Label>
      </StackLayout>
    </GridLayout>
  </GridLayout>
</template>
<script>
export default {
  props: ["route", "cache"],
  methods: {
    onTapped() {
      this.$emit("onTapped", this.route.id);
    }
  },
  computed: {
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
