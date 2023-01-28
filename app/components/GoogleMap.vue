<template>
  <AbsoluteLayout>
    <MapView
      :latitude="latitude"
      :longitude="longitude"
      :zoom="zoom"
      :bearing="bearing"
      :tilt="tilt"
      width="100%"
      height="100%"

      @ready="onMapReady"
      @markerTap="onMarkerSelect"
      @infoWindowTap="onMarkerInfoWindowTapped"
      @cameraPosition="onCameraChanged"
    ></MapView>
    <FlexboxLayout class="btn-img" top="20" justifyContent="space-around" :left="myLocBtnLeftPosition" width="35" height="35" @tap="myLocationButtonTap" >
      <Image class="myLocation" alignSelf="center" stretch="aspectFill" src="~/assets/images/location_current.png" ></Image>
    </FlexboxLayout>
  </AbsoluteLayout>
</template>

<script>
import * as geolocation from '@nativescript/geolocation';
import { Enums } from '@nativescript/core'
import {
  Marker,
  Polyline,
  CameraUpdate
} from "@nativescript/google-maps";
import { isAndroid, isIOS, screen } from "@nativescript/core/platform";
import { mapGetters } from "vuex";
import { Color } from "@nativescript/core/color";
import mapStyles from "~/assets/mapStyles.js";

import { Image } from "@nativescript/core/ui/image";
import { ImageSource } from "@nativescript/core/image-source";
import * as application from "@nativescript/core/application";
import * as utils from "~/plugins/utils";
import { crashlytics } from "@nativescript/firebase/crashlytics";

export default {
  props: ["pois", "currentPoi", "padding", "paths"],
  data() {
    return {
      enableCompass: true,
      enableTilt: true,
      latitude: 52.4958,
      longitude: 6.44117,
      zoom: 16,
      bearing: "",
      tilt: 0,
      markers: [],
      mapView: null,
      polyLines: [],
      ommenCenter: { position: { latitude: 52.4958, longitude: 6.44117 } },
      mapAnimationsEnabled: true
    };
  },
  computed: {
    ...mapGetters({
      screenOrientation: "screenOrientation"
    }),
    selectedMarker() {
      if (this.currentPoi) {
        return this.currentPoi;
      } else return null;
    },
    myLocBtnLeftPosition() {
      if(this.screenOrientation == 'portrait') {
        return screen.mainScreen.widthDIPs - 60;
      }
      else {
        return screen.mainScreen.heightDIPs + 150
      }
    },
  },
  watch: {
    paths (newVal) {
      if (this.mapView) {
        console.log('google map, paths changed! updating...')
        this.addPaths()
      }
    }
  },
  beforeDestroy() {
    console.log("Google map destroyed")

  },
  methods: {
    resizeMapHack() {
      if(!this.mapView) 
        return
      
    },
    enableMyLocation(value) {
      if (this.mapView) {
        console.log('enable my location:', value)
        this.mapView.myLocationEnabled = value
      }
    },
    getLocation() {
      console.log("MAP: getLocation");

      let that = this;
      return geolocation.isEnabled().then(
        function(isEnabled) {
          if (!isEnabled) {
            geolocation
              .enableLocationRequest(false, true)
              .then(
                () => {
                  geolocation
                    .getCurrentLocation({
                      desiredAccuracy: Enums.Accuracy.high,
                      timeout: 20000
                    })
                    .then(location => {
                      if (!location) {
                        console.log("Failed to get location!");
                        this.$toast.show("map.location.nolocation", {
                          shouldLocalize: true
                        });
                      } else {
                        console.log(
                          "!isEnabled - got user location, not doing anything..."
                        );
                        that.latitude = location.latitude;
                        that.longitude = location.longitude;
                        //that.zoom = 10;
                        //that.bearing = 0;
                        //that.altitude = 0;
                      }
                    });
                },
                e => {
                  console.log("Error: ", (e.message || e));
                  crashlytics.log("Unable to Enable Location", (e.message || e));
                }
              )
              .catch(ex => {
                console.log("Unable to Enable Location", ex);
                crashlytics.log("Unable to Enable Location" + ex);
                this.$toast.show("map.location.enableerror", {
                  shouldLocalize: true
                });
              });
          } else {
            geolocation
              .getCurrentLocation({
                timeout: 20000,
                desiredAccuracy: Enums.Accuracy.high
              })
              .then(location => {
                if (!location) {
                  console.log("Failed to get location!");
                  this.$toast.errorFriendly("map.location.nolocation", {
                    shouldLocalize: true
                  });
                } else {
                  that.latitude = location.latitude;
                  that.longitude = location.longitude;
                  console.log(
                    "isEnabled - Got user location, not doing anything"
                  );
                }
              });
          }
        },
        function(e) {
          console.log("Error: " + (e.message || e));
          this.$toast.show("map.location.error", { shouldLocalize: true });
        }
      );
    },
    initMapSettings() {
      
      const gMap = this.mapView;
      // can be done to hide infowindow
      // this.mapview.infoWindowTemplate = ''
      this.mapView.mapStyle = mapStyles.retro
      
      gMap.uiSettings.tiltGesturesEnabled = true
      gMap.uiSettings.rotateGesturesEnabled = true
      gMap.uiSettings.myLocationButtonEnabled = false
      gMap.uiSettings.mapToolbarEnabled = false

      geolocation.isEnabled().then(enabled => {
        gMap.myLocationEnabled = enabled
      })
    },
    showTitleForPoint(poi) {
      if (!poi || !poi.id) 
        return 

      this.markers.forEach(m => { 
        if (m.userData.id === poi.id) {
          m.showInfoWindow()
        }
        else {
          // hideinfowindow works differntly in ios (it just removes all markers)
          if(isAndroid)
            m.hideInfoWindow()
        }
      })
    },
    createMarkerFromPoi(poi, idx) {
      const poiMarker = {}
      poiMarker.position = {lat: poi.position.latitude, lng: poi.position.longitude}
      if (poi.routePoint) {
        poiMarker.title = `${idx + 1}. ${poi.title}`;
      }
      else {
        poiMarker.title = poi.title;
      }
      poiMarker.userData = Object.assign({poiIndex: idx}, poi)
      return poiMarker;
    },

    // TODO determine if some initialized params can be stored in VUEX (since opening modals/closing re-renders stuff and also repositions map sometimes...)
    onMapReady(args) {
      this.mapView = args.map; 
      console.log("what is zoom?", this.mapView.cameraPosition.zoom);
      // workaround for sizing the map correctly, at least on iOS
      this.resizeMapHack()
      
      this.getLocation().then(() => {
        this.initMapSettings()
      })
      
      this.addPaths()

      this.$emit("googleMapReady", true);
    },
    // https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
    distanceBetween(poi1, poi2) {
      var R = 6371.0710; // Radius of the Earth in km
      var rlat1 = poi1.position.latitude * (Math.PI/180); // Convert degrees to radians
      var rlat2 = poi2.position.latitude * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (poi2.position.longitude - poi1.position.longitude) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    },
    distanceFromOmmen(poi1, poi2) {
      return distanceBetween(poi1, this.ommen) - distanceBetween(poi2, this.ommen)
    },
    sortPointsOnDistance(pois) {
      if(pois && pois.length) {
        pois.sort(distanceBetween)
      }
    },
    animateToPoint(poi, padding, zoomLevel) {
      padding = padding || 40
      zoomLevel = zoomLevel || 11
      if (!poi) 
        return
      
      let locationToSet = {lat: poi.position.latitude, lng: poi.position.longitude}
      this.mapView.animateCamera(CameraUpdate.fromCoordinate(locationToSet, zoomLevel))
    },
    myLocationButtonTap() {
      let that = this
      
      geolocation.isEnabled().then(enabled => {
        if (enabled) {
          geolocation
            .getCurrentLocation({
              maximumAge: 5000,
              timeout: 20000
            })
            .then(location => {
              console.log("--moving to location", location)
              const zoom = this.mapView.cameraPosition.zoom
              let zoomLevel = 12 // zoom < 12 ? zoom : 12
              const locationToSet = {lat: location.latitude, lng: location.longitude }
              that.mapView.animateCamera(CameraUpdate.fromCoordinate(locationToSet, zoomLevel));
            });
        }
      });

    },
    addPaths() {
      const colors = [
        '#214a2c',
        '#21384a',
        '#1d1533',
        '#3c4034',
        '#40332c'
      ]

      // create route line
      if (this.paths && this.mapView) {

        // first remove existing lines
        console.log(this.polyLines)
        this.polyLines.forEach(line => this.mapView.removePolyline(line))
        this.polyLines = []

        let idx = 0
        this.paths.forEach(path => {
          idx++
          // draw the polyline
          const polyline = {}
          console.log("creating a line...", path.length);
          polyline.points = path.map(geoPoint => {
            return { lat: geoPoint.latitude, lng: geoPoint.longitude }
            
          });
          polyline.visible = true;
          polyline.width = 5;
          polyline.geodesic = false;
          polyline.color = new Color(colors[idx % 5]);
          const polyReference = this.mapView.addPolyline(polyline)
          this.polyLines.push(polyReference)
        })
      }
    },
    fitMapToPois(pois, padding) {
      if(!this.mapView || !pois)
        return

      console.log(`fitting map to ${pois.length} points...`)
      if(pois.length == 0)
        return
      
      padding = padding || 80;
      setTimeout(() => {
        let coordinates = pois.map((poi) => { return { lat: poi.position.latitude, lng: poi.position.longitude }} )
        this.mapView.animateCamera( CameraUpdate.fromCoordinates(coordinates, padding) )
      }, 200)
      
    },
    addMapMarkers() {
      console.log(
        " ADDING POINTS: " + (this.pois ? this.pois.length : "EMPTY")
      );
      

      if (this.pois && this.pois.length) {
        let poiIndex = 0
        
        // first remove existing markers
        this.markers.forEach(marker => this.mapView.removeMarker(marker))
        this.markers = []

        this.pois.forEach(poi => {
          const marker = this.createMarkerFromPoi(poi, poiIndex);
          
          const icon = utils.getPoiIcon(poi);
          if (icon) {
            // TODO cache?
            const iconImg = new Image();

            if (isIOS) {
              iconImg.imageSource = ImageSource.fromFileSync(
                `~/assets/images/markers/${icon}@0.75x.png`
              );
            } else {
              iconImg.imageSource = ImageSource.fromFileSync(
                `~/assets/images/markers/${icon}@1.5x.png`
              );
            }

            marker.icon = iconImg;
          }
          poiIndex++
          const markerReference = this.mapView.addMarker(marker)
          this.markers.push(markerReference)
        });
      }
    },
    onMarkerSelect(m) {
      this.$emit("markerSelect", m.marker);
    },
    onMarkerInfoWindowTapped(t) {
      this.$emit("onMarkerInfoWindowTapped", t);
    },
    onCameraChanged(args) {
      if(!this.mapView) 
      { 
        console.log('mapview not ready yet, ignoring event')
        return;
      }
      // set zoom to store
      this.$store.commit('setMapZoom', this.mapView.cameraPosition.zoom)
    }
  }
};
</script>

<style lang="scss" scoped>

.btn-img {
  border-radius: 20;
  background-color: white;
}
.myLocation {
  width: 50%;
  height: 50%;
  vertical-align: middle;
}
</style>
