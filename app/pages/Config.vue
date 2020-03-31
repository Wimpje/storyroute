<template>
  <Page class="page" @loaded="onLoaded" ios.actionBarHidden="false">
    <android>
      <AppActionBar></AppActionBar>
    </android>
    <GridLayout rows="auto, auto, auto, *" class="container">
      <Label row="1" :text="'config.help' | L" class="helptext" textWrap="true"></Label>
      <StackLayout row="2" class="hr m-20"></StackLayout>
      <StackLayout row="3" class="settings">
        <!-- <StackLayout class="setting" orientation="horizontal">
          <Switch checked="true" @checkedChange="toggleDark" />
          <Label :text="'Dark mode' | L"></Label>
        </StackLayout>-->
        <StackLayout class="setting" orientation="horizontal">
          <Switch v-model="toggleAnalytics"/>
          <Label class="m-y-auto" :text="'config.analyticsInfo' | L" textWrap="true"></Label>
        </StackLayout>
        <StackLayout class="setting" orientation="horizontal">
          <Switch v-model="toggleCrashInfo"  />
          <Label class="m-y-auto" :text="'config.crashInfo' | L" textWrap="true"></Label>
        </StackLayout>
        <StackLayout class="setting" orientation="horizontal" v-if="!allDownloaded">
          <Button class="-primary -rounded-sm" text="download" @tap="downloadAll" />
          <Label class="m-y-auto" :text="'config.downloadAll' | L" textWrap="true"></Label>
        </StackLayout>
        <StackLayout class="setting" orientation="horizontal" v-if="allDownloaded">
          <Button class="-primary -rounded-sm" :text="'btn.refreshDownloadAll' | L" @tap="downloadAll" />
          <Label class="m-y-auto" :text="'config.refreshDownloadAll' | L" textWrap="true"></Label>
        </StackLayout>
        <StackLayout v-if="isDebug" class="setting" orientation="horizontal">
          <Button class="danger -rounded-sm" text="crash!" @tap="crash" ></Button>
        </StackLayout>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import Theme from "@nativescript/theme";
import * as firebase from "nativescript-plugin-firebase";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import * as utils from "~/plugins/utils";

export default {
  mounted() {
    this.allDownloaded = getBoolean('allDownloaded', false)
  },
  data() {
    return {
      loading: false,
      allDownloaded: false
    }
  },
  computed: {

    toggleCrashInfo: {
      get() {
        return getBoolean('googleCrashlytics')
      },
      set(val) {
        console.log("toggleCrashConfig", val);
        setBoolean('googleCrashlytics', val)
        firebase.crashlytics.setCrashlyticsCollectionEnabled(val);
      }
    },
    isDebug() {
      return TNS_ENV !== 'production'
    },
    toggleAnalytics: {
      get () {
        return getBoolean('googleAnalytics')
      },
      set (val) {
        console.log("toggle analytics", val);
        setBoolean('googleAnalytics', val)
        firebase.analytics.setAnalyticsCollectionEnabled(val);
      }

    }
  },
  methods: {
    close() {
      this.$modal.close();
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "config", instance: this });
  
      if (!this.credits) {
        this.$store.dispatch("getArticles").then(() => {
          this.loading = false
          
        }).catch(err => {
          this.loading = false
        })
      }
    },

    downloadAll() {
      this.$toast.show('Sorry not supported yet')
      // utils.downloadAllResources()
    },
    toggleDark() {
      Theme.toggleMode(); // to toggle between the modes
    },
    crash() {
      firebase.crashlytics.crash();
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  margin: 20;
}
.helptext {
  margin-bottom:20;
}
.danger {
  background-color: #dd3d31;
  color: white;
}
.info {
  font-size: 20;
}
</style>
