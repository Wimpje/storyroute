<template>
  <Page class="page" @loaded="onLoaded" ios.actionBarHidden="false">
    <android>
      <AppActionBar></AppActionBar>
    </android>
      <ScrollView>
        <StackLayout class="m-20">
        <Label :text="help.text" class="helptext" textWrap="true"></Label>
        <StackLayout v-if="credits">
          <StackLayout class="hr m-20"></StackLayout>
          <Label :text="'help.credits' | L" class="h2"></Label> 
          <Label :text="credits.text" class="creditsText" textWrap="true"></Label>
        </StackLayout>
        <StackLayout v-if="contact">
          <StackLayout class="hr m-20"></StackLayout>
          <Label :text="'help.contact' | L" class="h2"></Label> 
          <Label :text="contact.text" class="creditsText" textWrap="true"></Label>
          <Button v-if="contactEmail" @tap="email" :text="contactEmail"></Button>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as application from "tns-core-modules/application";
import Theme from "@nativescript/theme";
import * as firebase from "nativescript-plugin-firebase";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import * as utils from "~/plugins/utils";
import { mapGetters, mapActions } from "vuex";
import * as email from "nativescript-email";
import { localize } from "nativescript-localize";

export default {
  mounted() {
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
     ...mapGetters({
      credits: "getCredits",
      help: "getHelp",
      contact: "getContact"
    }),
   
    isDebug() {
      return TNS_ENV !== 'production'
    },
    contactEmail() {
      if(this.contact && this.contact.urls) {
        const emailUrl = this.contact.urls.filter(url => url.url.indexOf('mailto:') > -1)
        if(emailUrl.length > 0)
          return emailUrl[0].url.substring(7)
      }
      return ''
    }
  },
  methods: {
    close() {
      this.$modal.close();
    },
    email() {
      email.available().then((avail) => {
        if (avail) {
          email.compose({
            subject: localize('email.subject'),
            body: localize('email.subject'),
            to: [this.contactEmail]
          }).then(result => {
            console.log('email compose closed')
          }).catch(err => {
            firebase.crashlytics.log("email send error " + err)
            console.error(err)
          })
        }
        else {
          this.$toast.show(localize('email.appnotfound') + ' ' + this.contactEmail)
        }
      })
    },
    onLoaded() {
      this.$store.commit("setCurrentPage", { name: "help", instance: this });
      this.$store.dispatch("getArticles").then(() => {
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },

    toggleDark() {
      Theme.toggleMode(); // to toggle between the modes
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

.info {
  font-size: 20;
}
</style>
