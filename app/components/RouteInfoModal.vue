<template>
  <GridLayout rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
    <Image
      width="100%"
      class="routeImage"
      marginBottom="10"
      stretch="aspectFill"
      :src="route.leadImage"
      row="0"
    />
    <StackLayout class="routeInfo" backgroundColor="#489e9e9e" row="1">
      <Label :text="route.title" class="routeName" textwrap="true"></Label>
      <Label :text="route.description" class="routeDescription" textwrap="true"></Label>
    </StackLayout>

    <StackLayout class="actions" row="2">
      <Button text="Start Route" @tap="startRoute()"></Button>
      <Button text="close" @tap="close()"></Button>
    </StackLayout>
  </GridLayout>
</template>
<script>
export default {
  props: ["route"],
  methods: {
    onTapped() {
      this.$emit("onTapped", this.route.id);
    },
    startRoute() {
      this.$modal.close(this.route);
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    image() {
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
