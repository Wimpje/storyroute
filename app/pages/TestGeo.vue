<template>
  <Page class="page" @loaded="onLoaded" actionBarHidden="true">
    <GridLayout rows="100, *, 50, 50">
      <GridLayout row="0" columns="*, *, *,*, *">
        <Button text="Enable Location" col="0" textWrap="true" @tap="enableLocationTap" />
        <Button text="Get Current Location" col="1" textWrap="true" @tap="buttonGetLocationTap" />
        <Button text="Start Monitoring" col="2" textWrap="true" @tap="buttonStartTap" />
        <Button text="Stop Monitoring" col="3" textWrap="true" @tap="buttonStopTap" />
        <Button text="Store to Firebase" col="4" textWrap="true" @tap="buttonSave" />
      </GridLayout>
      <ListView row="1" for="location in locations" height="100%">
        <v-template>
          <Label :text="location.latitude + ', ' + location.longitude + ', ' + location.altitude" />
        </v-template>
      </ListView>
      <Button row="2" @tap="close" text="Close" />
      <Button text="Clear" row="3" @tap="buttonClearTap" />
    </GridLayout>
  </Page>
</template>

<script>
import * as geolocation from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core'
import { firebase } from "@nativescript/firebase"


class POI {
  constructor(loc) {
    this.point = loc;
    this.title = "";
  }
}

export default {
  mounted() {
  },
  data() {
    return {
      watchIds: [],
      locations: []
    };
  },
  methods: {
    onLoaded() {
      this.$store.commit('setCurrentPage',  { name: 'testgeo', instance: this })
    },
    close() {
      this.$modal.close()
    },
    buttonSave: function(e) {
      console.log("saveing", e);
    },
    enableLocationTap: function() {
      geolocation.isEnabled().then(
        function(isEnabled) {
          if (!isEnabled) {
            geolocation.enableLocationRequest().then(
              function() {},
              function(e) {
                console.log("Error: " + (e.message || e));
              }
            );
          }
        },
        function(e) {
          console.log("Error: " + (e.message || e));
        }
      );
    },
    buttonGetLocationTap: function() {
      let that = this;
      geolocation
        .getCurrentLocation({
          desiredAccuracy: CoreTypes.Accuracy.high,
          maximumAge: 5000,
          timeout: 10000
        })
        .then(
          function(loc) {
            if (loc) {
              that.locations.push(loc);
            }
          },
          function(e) {
            console.log("Error: " + (e.message || e));
          }
        );
    },
    buttonStartTap: function() {
      try {
        let that = this;
        this.watchIds.push(
          geolocation.watchLocation(
            function(loc) {
              if (loc) {
                that.locations.push(loc);
              }
            },
            function(e) {
              console.log("Error: " + e.message);
            },
            {
              desiredAccuracy: CoreTypes.Accuracy.high,
              updateDistance: 1,
              updateTime: 3000,
              minimumUpdateTime: 100
            }
          )
        );
      } catch (ex) {
        console.log("Error: " + ex.message);
      }
    },
    buttonStopTap: function() {
      let watchId = this.watchIds.pop();
      while (watchId != null) {
        geolocation.clearWatch(watchId);
        watchId = this.watchIds.pop();
      }
    },
    buttonClearTap: function() {
      this.locations.splice(0, this.locations.length);
    }
  }
};
</script>

<style scoped lang="scss">
.info {
  font-size: 20;
}
</style>
