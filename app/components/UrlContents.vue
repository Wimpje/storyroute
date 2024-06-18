<template>
  <StackLayout class="urlContainer" v-if="urls">
    <StackLayout @tap="openUrl(url.url)" class="urlBlock" v-for="(url, idx) in urls" :key="url.url">
      <Label textWrap="true">
        <FormattedString>
          <Span class="fas" text.decode="&#xf35d; " />
          <Span :text="url.title" class="title" />
        </FormattedString>
      </Label>
      <Label :text="url.url" />
      <StackLayout v-if="addDivider && idx !== (urls.length - 1)" class="hr m-10"></StackLayout>
    </StackLayout>
  </StackLayout>
</template>
<script>
import { firebase } from "@nativescript/firebase-core"
import '@nativescript/firebase-analytics';

import * as utils from "@nativescript/core/utils";

export default {
  components: {},
  props: ["urls", "addDivider"],
  methods: {
    moreInfo(event) {
      console.log("more info");
    },
    openUrl(url) {
      firebase().analytics()
        .logEvent({
          key: "url_click",
          parameters: [
            // optional
            {
              key: "url",
              value: url
            }
          ]
        })
        .then(function() {
          console.log("analytics - logged url_click");
        });

      utils.openUrl(url);
    }
  },
  computed: {},
  data() {
    return {};
  }
};
</script>
<style scoped lang="scss">
//@import "~@nativescript/theme/scss/variables/grey";
.title {
  font-weight: bold;
  font-size: 14;
}
.urlBlock {
  margin-bottom: 5;
}
</style>
