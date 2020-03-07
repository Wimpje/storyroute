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
      <GridLayout class="routeInfo" backgroundColor="#489e9e9e" row="1" rows="50, *">
        <Label row="0" :text="route.title" class="routeName" textWrap="true"></Label>
        <Label row="1" :text="route.description" class="routeDescription" textWrap="true"></Label>
      </GridLayout>

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
.default-img {
  color: #d1cece5b;
}
.routeImage {
  margin-bottom: 10;
}
.routeDescription {
  horizontal-align: top;
  vertical-align: top;
  padding: 20 20 20 20;
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
