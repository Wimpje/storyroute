<template>
  <StackLayout width="100%" height="100%">
    <MapView
      :latitude="latitude"
      :longitude="longitude"
      :zoom="zoom"
      :bearing="bearing"
      height="100%"
      width="100%"
      @mapReady="onMapReady"
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
const Image = require("tns-core-modules/ui/image").Image;
import {
  ImageSource,
  fromFile,
  fromResource,
  fromBase64
} from "tns-core-modules/image-source";

export default {
  props: ["pois", "currentPoi"],
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
  computed: {
    selectedMarker() {
      if (this.currentPoi) {
        return this.currentPoi;
      } else return null;
    }
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
                      console.log('location found, not setting it ')
                      /*
                      that.latitude = location.latitude;
                      that.longitude = location.longitude;
                      that.zoom = 14;
                      that.bearing = 0;
                      that.altitude = 0;*/
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
                console.log('location found, not setting it ')
                /*
                that.latitude = location.latitude;
                that.longitude = location.longitude;
                that.zoom = 14;
                that.bearing = 0;
                that.altitude = 0;*/
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
          marker.poi = poi;

          /*
          let icon = new Image();
          icon.src = '~/images/pin.png';
          icon.imageSource = fromFile('~/images/pin.png');
          marker.icon=icon;
          */
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
      this.mapView.addMarker(poiMarker);

      return poiMarker;
    },
    onMapReady(args) {
      this.mapView = args.object;

      // workaround for sizing the map correctly
      setTimeout(
        () =>
          (this.mapView.height = {
            unit: "%",
            value: 0.999
          }),
        1
      );

      var gMap = this.mapView.gMap;

      this.mapView.settings.mapToolbarEnabled = false;
      this.mapView.settings.rotateGesturesEnabled = true;
      this.mapView.settings.tiltGesturesEnabled = false;
      this.mapView.settings.myLocationEnabled = true;
      this.mapView.settings.myLocationButtonEnabled = true;
      this.mapView.settings.compassEnabled = true;
      this.mapView.settings.zoomGesturesEnabled = true;

      // can be done to hiude infowindow
      // this.mapview.infoWindowTemplate = ''

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

      let bounds;
      let padding = 100;
      if (isIOS) {
        bounds = GMSCoordinateBounds.alloc().init();
      }

      console.log(
        "MAPREADY -  ADDING POINTS: " + (this.pois ? this.pois.length : "EMPTY")
      );
      this.addMarkersFromPois(this.pois);
      if (isIOS) {
        this.pois.forEach(poi => {
          const pos = Position.positionFromLatLng(
            poi.position.latitude,
            poi.position.longitude
          );
          bounds = bounds.includingCoordinate(pos.position);
        });
      }
      if (isAndroid) {
        const builder = new com.google.android.gms.maps.model.LatLngBounds.Builder();
        this.mapView.findMarker(function(marker) {
          builder.include(marker.android.getPosition());
        });
        bounds = builder.build();
        const cu = com.google.android.gms.maps.CameraUpdateFactory.newLatLngBounds(
          bounds,
          padding
        );
        this.mapView.gMap.animateCamera(cu);
      }
      if (isIOS) {
        var update = GMSCameraUpdate.fitBoundsWithPadding(bounds, padding);
        this.mapView.gMap.animateWithCameraUpdate(update);
      }

      this.$emit("mapReady");
    },
    onMarkerSelect(m) {
      this.$emit("markerSelect", m.marker);
    },
    onMarkerInfoWindowTapped(t) {
      this.$emit("onMarkerInfoWindowTapped", t);
    }
  }
};
</script>

<style>
</style>
