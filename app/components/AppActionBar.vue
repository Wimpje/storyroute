<template>
  <ActionBar class="action-bar" @loaded="onLoaded" >
    <ios>
      <ActionItem :visibility="shouldShowBack ? 'visible' : 'collapsed'" position="left" :text="'btn.backIos' | L" @tap="backButton"/>
      <ActionItem
        v-show="!shouldShowBack"
        :icon="menuIcon"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>
      <ActionItem
        ios.position="right"
        ios.systemIcon="9"
        :text="'btn.share' | L"
        v-show="shouldShowShare"
        @tap="share">
      </ActionItem>
    </ios>
    <android>
      <NavigationButton :visibility="isAndroid ? 'visible' : 'collapsed'"
        :icon="menuIcon"
        @tap="androidMenuTap"></NavigationButton> 
      <ActionItem
        android.position="actionBar"
        android.systemIcon="ic_menu_share"
        :text="'btn.share' | L"
        v-show="shouldShowShare"
        @tap="share">
      </ActionItem>
    </android>  
   
    <Label class="action-bar-title" :text="currentPageText"></Label>
  </ActionBar>
</template>

<script>
import * as utils from "~/plugins/utils";
import firebase from "nativescript-plugin-firebase";
import { mapGetters } from "vuex";
import { isAndroid, isIOS } from "tns-core-modules/platform"
import { Directions } from "nativescript-directions";
import * as SocialShare from "nativescript-social-share";
import { localize } from "nativescript-localize";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from "tns-core-modules/application";

export default {
  data() {
    return {
      nativeThing: null
    }
  },
  computed: {
    ...mapGetters(['currentPageText', 'currentIsTabView', 'currentMenuItems']),
    shouldShowMaps() {
      return this.currentMenuItems && this.currentMenuItems.filter(item => item === 'maps').length > 0
    },
    shouldShowShare() {
      return this.currentMenuItems && this.currentMenuItems.filter(item => item === 'share').length > 0
    },
    shouldShowBack() {
      return !this.currentIsTabView
    },
    isAndroid() {
      return isAndroid
    },
    isIOS() {
      return isIOS
    },
    menuIcon() {
      if(this.shouldShowBack) {
        // application.systemAppearance() crashes iOS atm TODO make bug report
        if(isAndroid && application.systemAppearance() === 'dark')
          return 'res://action_back_white'
        else 
          return 'res://action_back_black'
      }
      else {
        if(isAndroid && application.systemAppearance() === 'dark')
          return 'res://action_menu_white'
        else {
          return 'res://action_menu_black'
        }
      }
    }
  },
  methods: {
    onLoaded(args) {
   
    },
    androidMenuTap() {
      if(this.shouldShowBack) {
        this.backButton()
      }
      else {
        this.onDrawerButtonTap()
      }
    },
    maps() {
      console.log('maps')
      this.openNavigationTo()
    },
    share() {
      console.log('share')
      // open share dialog
      this.shareAction()
 
    },
    shareAction() {
      const actionObj = this.createActionObject()
      if(actionObj.type) {
        SocialShare.shareText(localize(`share.${actionObj.type}`) + ` - ${actionObj.title} @ https://75jaarbevrijdingommenapp.nl/${actionObj.type}/${actionObj.id}` );
        console.log('sharing this')
        firebase.analytics.logEvent({
          key: "share_action",
          parameters: [ // optional
            {
              key: "type",
              value: actionObj.type
            },
            {
              key: "title",
              value: actionObj.title
            }]
        }).then(
            function () {
              console.log("analytics - logged share");
            }
        );
      }
      else {
        console.error('something wrong trying to share')
      }
    },
    createActionObject() {
      const ret = {}
      if(this.$store.getters.currentPoi) {
        // go to point
        ret.position = this.$store.getters.currentPoi.position
        ret.title = this.$store.getters.currentPoi.title
        ret.id = this.$store.getters.currentPoi.id
        ret.description =  this.$store.getters.currentPoi.description
        ret.type = 'point'
      }
      else if (this.$store.getters.currentRoute) {
        // go to first point of route
        const startPoint = this.$store.getters.currentRoute.pois[0];
        if(startPoint) {
          ret.position = startPoint.position
          ret.title = this.$store.getters.currentRoute.title
          ret.id = this.$store.getters.currentRoute.id
          ret.text = this.$store.getters.currentRoute.description
          ret.type = 'route'
        }
      }
      else if (this.$store.getters.currentArticle) {
        ret.title = this.$store.getters.currentArticle.title
        ret.description =  this.$store.getters.currentArticle.text
        ret.id =  this.$store.getters.currentArticle.id
        ret.type = 'article'
      }
      return ret
    },
    openNavigationTo() {
      const actionObj = this.createActionObject()
      if(!actionObj.type && actionObj.type !== 'article')
        return

      console.log("open maps application to go to:", );
      firebase.analytics.logEvent({
        key: "open_map",
        parameters: [ // optional
          {
            key: "type",
            value: actionObj.type
          },
          {
            key: "point_name",
            value: actionObj.title
          }]
      }).then(
          function () {
            console.log("analytics - logged open_map");
          }
      );
      let directions = new Directions();
      directions.available().then(avail => {
        if (avail) {
          directions
            .navigate({
              to: {
                lat: actionObj.position.latitude,
                lng: actionObj.position.longitude
              }
            })
            .then(
              function() {
                console.log("Maps app launched.");
              },
              function(error) {
                console.log(error);
              }
            );
        } else {
          this.$toast.errorFriendly('map.noappfound', {shouldLocalize:true})
        }
      });
    },
    backButton() {
      this.$myNavigateBack()
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style lang="scss" scoped>
.shareIcon {
  font-size: 12;
}
.action-bar-title {
  
}
</style>
