<template>
  <Page>
    <AppActionBar page="Route info"></AppActionBar>
    <GridLayout rows="150,*,auto" columns="*" iosOverflowSafeArea="true">
      <NsImg
        width="100%"
        class="routeImage"
        marginBottom="10"
        stretch="aspectFill"
        :src="image"
        :placeholder-image-uri="placeholder"
        :failure-image-uri="placeholder"
        row="0"
      />
      <StackLayout class="routeInfo" backgroundColor="#489e9e9e" row="1">
        <Label :text="route.title" class="routeName" textwrap="true"></Label>
        <Label :text="route.description" class="routeDescription" textwrap="true"></Label>
      </StackLayout>

      <StackLayout class="actions" row="2">
        <Button class="-outline" text="Start Route" @tap="startRoute()"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>
<script>
import { routes } from "~/router";
export default {
  props: ["route"],
  methods: {
    startRoute() {
      this.$navigateTo(router.route, { props: { route: this.route } });
    },
    close() {
      this.$modal.close();
    }
  },
  computed: {
    image() {
      if (this.route && this.route.leadImage) {
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
