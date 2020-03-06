<template>
  <Page class="page">
    <GridLayout rows="auto, auto, *,auto, auto">
      <GridLayout row="0" columns="*, *, *,*, *">
        <Button text="Enable Location" col="0" textWrap="true" @tap="enableLocationTap" />
        <Button text="Get Current Location" col="1" textWrap="true" @tap="buttonGetLocationTap" />
        <Button text="Start Monitoring" col="2" textWrap="true" @tap="buttonStartTap" />
        <Button text="Stop Monitoring" col="3" textWrap="true" @tap="buttonStopTap" />
        <Button text="Store to Firebase" col="4" textWrap="true" @tap="buttonSave" />
      </GridLayout>

      <Button text="Clear" row="3" @tap="buttonClearTap" />
    </GridLayout>
  </Page>
</template>

<script>
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
const firebase = require("nativescript-plugin-firebase/app");

class POI {
  constructor(loc) {
    this.point = loc;
    this.title = "";
  }
}

export default {
  data() {
    return {
      watchIds: [],
      locations: []
    };
  },
  methods: {
    buttonSave: function() {
      console.log("saveing");
    },
    enableLocationTap: function() {
      geolocation.isEnabled().then(
        function(isEnabled) {
          if (!isEnabled) {
            geolocation.enab;
            leLocationRequest().then(
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
          desiredAccuracy: Accuracy.high,
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
              desiredAccuracy: Accuracy.high,
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
