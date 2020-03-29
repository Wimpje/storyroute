<template>
  <RadSideDrawer ref="drawer" gesturesEnabled="true" drawerLocation="left" @loaded="onLoaded">
    <StackLayout ~drawerContent class="drawer">
      <slot name="drawerContent"></slot>
    </StackLayout>
    <Frame ~mainContent id="mainContent">
      <slot name="mainContent"></slot>
    </Frame>
  </RadSideDrawer>
</template>

<script>
import { SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import { localize } from "nativescript-localize";
import { device } from "@nativescript/core/platform";

export default {
  data() {
    return {
      transition: new SlideInOnTopTransition()
    };
  },
  mounted() {
    
  },
  methods: {
    onLoaded() {
      // this.showLanguageWarningPopup()
    },
    showLanguageWarningPopup() {
      const lang = device.language.split("-")[0];
      console.log("User language = ", lang);
      if (lang !== "nl" && !getBoolean("englishMessageDisplayed", false)) {
        console.log("will show english dialog");
        dialogs
          .alert({
            title: localize("message.englishNotYetSupportedTitle"),
            message: localize("message.englishNotYetSupportedMessage"),
            okButtonText: localize("message.englishNotYetSupportedButton")
          })
          .then(() => {
            console.log("English message dialog closed!");
            setBoolean("englishMessageDisplayed", true);
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
//@import "~@nativescript/theme/scss/variables/grey";
</style>
