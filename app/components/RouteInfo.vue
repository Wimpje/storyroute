<template>
  <Page class="page">
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
      <GridLayout class="routeInfo" row="1" rows="80, *">
        <Label row="0" :text="route.title" class="h1 routeName" textWrap="true"></Label>
        <Label row="1" :text="route.description" class="body routeDescription" textWrap="true"></Label>
      </GridLayout>

      <StackLayout class="actions" row="2">
        <Button class="-outline" text="Start Route" @tap="startRoute"></Button>
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
      this.$navigateTo(routes.route, { props: { route: this.route } });
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
.routeImage {
  margin-bottom: 10;
}
.routeInfo {
  background-color: #489e9e9e;
}
.routeDescription {
  vertical-align: top;
  padding: 20 20 20 20;
  font-size: 18;
}
.routeName {
  padding: 5 20 5 20;
}
</style>
