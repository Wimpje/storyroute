<template>
  <StackLayout width="100%" height="100%">
    <MapView
      :latitude="latitude"
      :longitude="longitude"
      :zoom="zoom"
      :bearing="bearing"
      :tilt="tilt"
      compassEnabled="true"
      @mapReady="onMapReady"
      height="100%"
      width="100%"
      @markerSelect="onMarkerSelect"
      @markerInfoWindowTapped="onMarkerInfoWindowTapped"
    ></MapView>
  </StackLayout>
</template>

<script>
import * as geolocation from "nativescript-geolocation";
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { mapGetters } from "vuex";

export default {
  props: ["pois"],
  data() {
    return {
      latitude: "",
      longitude: "",
      zoom: "",
      bearing: "",
      tilt: "",
      mapView: null,
      markers: []
    };
  },

  mounted() {
    let that = this;
    geolocation.isEnabled().then(
      function(isEnabled) {
        if (!isEnabled) {
          geolocation
            .enableLocationRequest(true, true)
            .then(
              () => {
                that.isMounted = true;
                if (isAndroid && that.mapView) {
                  let uiSettings = that.mapView.gMap.getUiSettings();
                  uiSettings.setMyLocationButtonEnabled(true);
                  that.mapView.gMap.setMyLocationEnabled(true);
                }
                geolocation
                  .getCurrentLocation({
                    timeout: 20000
                  })
                  .then(location => {
                    if (!location) {
                      console.log("Failed to get location!");
                    } else {
                      that.latitude = location.latitude;
                      that.longitude = location.longitude;
                      that.zoom = 14;
                      that.bearing = 0;
                      that.altitude = 0;
                    }
                  });
              },
              e => {
                console.log("Error: " + (e.message || e));
              }
            )
            .catch(ex => {
              console.log("Unable to Enable Location", ex);
            });
        } else {
          that.isMounted = true;
          if (isAndroid && that.mapView) {
            let uiSettings = that.mapView.gMap.getUiSettings();
            uiSettings.setMyLocationButtonEnabled(true);
            that.mapView.gMap.setMyLocationEnabled(true);
          }
          geolocation
            .getCurrentLocation({
              timeout: 20000
            })
            .then(location => {
              if (!location) {
                console.log("Failed to get location!");
              } else {
                that.latitude = location.latitude;
                that.longitude = location.longitude;
                that.zoom = 14;
                that.bearing = 0;
                that.altitude = 0;
              }
            });
        }
      },
      function(e) {
        console.log("Error: " + (e.message || e));
      }
    );
  },
  methods: {
    getPoints() {
      this.addMarkersFromPois(this.pois);
    },
    addMarkersFromPois(pois) {
      this.mapView.removeAllMarkers();
      this.markers = [];
      if (pois && pois.length) {
        pois.forEach(poi => {
          const marker = this.addMarkerFromPoi(poi);
          this.markers.push(marker);
        });
      }
    },
    addMarkerFromPoi(poi) {
      const poiMarker = new Marker();
      poiMarker.position = Position.positionFromLatLng(
        poi.position.latitude,
        poi.position.longitude
      );
      poiMarker.title = poi.title;
      poiMarker.snippet = poi.description;
      this.mapView.addMarker(poiMarker);
      return poiMarker;
    },
    onMapReady(args) {
      this.mapView = args.object;
      if (isIOS) {
        setTimeout(
          () =>
            (this.mapView.height = {
              unit: "%",
              value: 0.999
            }),
          1
        );
      }
      var gMap = this.mapView.gMap;
      this.mapView.settings.myLocationEnabled = true;
      this.mapView.settings.myLocationButtonEnabled = true;
      this.mapView.settings.compassEnabled = true;
      this.mapView.settings.zoomGesturesEnabled = true;
      if (isAndroid && this.isMounted && geolocation.isEnabled()) {
        let uiSettings = gMap.getUiSettings();
        uiSettings.setMyLocationButtonEnabled(true);
        gMap.setMyLocationEnabled(true);
      }
      if (isIOS) {
        gMap.myLocationEnabled = true;
        gMap.settings.myLocationButton = true;
        this.mapView.on("myLocationTapped", event => {
          geolocation.isEnabled().then(enabled => {
            if (enabled) {
              geolocation
                .getCurrentLocation({
                  maximumAge: 5000,
                  timeout: 20000
                })
                .then(location => {
                  gMap.animateToLocation(location);
                });
            }
          });
        });
      }
      this.markers = [];
      console.log(
        "MAPREADY< ADDING POINTS: " + (this.pois ? this.pois.length : "EMPTY")
      );
      this.addMarkersFromPois(this.pois);
    },
    onMarkerSelect() {},
    onMarkerInfoWindowTapped() {}
  }
};
</script>

<style>
</style>
