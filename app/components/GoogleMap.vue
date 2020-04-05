<template>
  <StackLayout width="100%" height="100%">
    <MapView
      :latitude="latitude"
      :longitude="longitude"
      :zoom="zoom"
      :bearing="bearing"
      :tilt="tilt"
      :padding="padding"
    
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
import {
  MapView,
  Marker,
  Position,
  Polyline
} from "nativescript-google-maps-sdk";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { mapGetters } from "vuex";
import { Color } from "tns-core-modules/color";
import mapStyles from "~/assets/mapStyles.js";

import { Image } from "tns-core-modules/ui/image/image";
import { ImageSource } from "tns-core-modules/image-source";
import * as application from "tns-core-modules/application";

export default {
  props: ["pois", "currentPoi", "padding", "paths"],
  data() {
    return {
      enableMyLocation: true,
      enableMyLocationButton: true,
      enableCompass: true,
      enableTilt: true,
      latitude: 52.4958,
      longitude: 6.44117,
      zoom: 16,
      bearing: "",
      tilt: 0,
      markers: [],
      mapView: null,
      ommenCenter: Position.positionFromLatLng(52.4958, 6.44117),
      mapAnimationsEnabled: true
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
    // determine if we should use this hook or @loaded... timing sometimes is weird on iOS it seems
    this.onLoaded();
  },
  destroy() {
    if (application.android) {
      application.android.off(
        application.AndroidApplication.activityResumedEvent,
        this.onAndroidActivityResume,
        this
      );
    }
  },
  methods: {
    onAndroidActivityResume(args) {
      console.log("MAP: ON ANDROID RESUME");
      if (
        this.mapView &&
        this.mapView.nativeView &&
        this.mapView._context === args.activity
      ) {
        this.mapView.nativeView.onResume();
      }
    },
    onLoaded() {
      console.log("MAP: ONLOADED");
      if (application.android) {
        application.android.on(
          application.AndroidApplication.activityResumedEvent,
          this.onAndroidActivityResume,
          this
        );
      }

      let that = this;
      

      geolocation.isEnabled().then(
        function(isEnabled) {
          if (!isEnabled) {
            // only enable if geolocation is enabled
            this.mapView.myLocationEnabled = that.enableMyLocation;
            this.mapView.settings.myLocationButtonEnabled = that.enableMyLocationButton;

            geolocation
              .enableLocationRequest(true, true)
              .then(
                () => {
                  that.isMounted = true;
                  geolocation
                    .getCurrentLocation({
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
                        //that.latitude = location.latitude;
                        //that.longitude = location.longitude;
                        //that.zoom = 10;
                        //that.bearing = 0;
                        //that.altitude = 0;
                      }
                    });
                },
                e => {
                  console.log("Error: " + (e.message || e));
                  firebase.crashlytics.log("Unable to Enable Location" + (e.message || e));
                }
              )
              .catch(ex => {
                console.log("Unable to Enable Location", ex);
                firebase.crashlytics.log("Unable to Enable Location" + ex);
                this.$toast.show("map.location.enableerror", {
                  shouldLocalize: true
                });
              });
          } else {
            that.isMounted = true;
            geolocation
              .getCurrentLocation({
                timeout: 20000
              })
              .then(location => {
                if (!location) {
                  console.log("Failed to get location!");
                  this.$toast.errorFriendly("map.location.nolocation", {
                    shouldLocalize: true
                  });
                } else {
                  console.log(
                    "isEnabled - Got user location, not doing anything"
                  );
                  //that.latitude = location.latitude;
                  //that.longitude = location.longitude;
                  //that.zoom = 10;
                  //that.bearing = 0;
                  //that.altitude = 0;
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
      
      const gMap = this.mapView.gMap;
      // can be done to hide infowindow
      // this.mapview.infoWindowTemplate = ''
      this.mapView.setStyle(mapStyles.retro);

      if (isAndroid && this.isMounted && geolocation.isEnabled()) {
        let uiSettings = gMap.getUiSettings();
        uiSettings.setMyLocationButtonEnabled(true);
        uiSettings.setTiltGesturesEnabled(true);
        uiSettings.setRotateGesturesEnabled(true);
        gMap.setMyLocationEnabled(true);
      }
      if (isIOS) {
        gMap.myLocationEnabled = true;
        gMap.settings.myLocationButton = true;
        gMap.settings.tiltGesturesEnabled = true;
        this.mapView.on("myLocationTapped", event => {
          console.log('IOS tapped on "my location" button');
          geolocation.isEnabled().then(enabled => {
            if (enabled) {
              geolocation
                .getCurrentLocation({
                  maximumAge: 5000,
                  timeout: 20000
                })
                .then(location => {
                  console.log("--moving to location", location);
                  gMap.animateToLocation(location);
                });
            }
          });
        });
      }
    },
    showTitleForPoint(poi) {
      if (!poi || !poi.id) 
        return 

      this.markers.forEach(m => { 
        if (m.userData.id === poi.id) {
          m.showInfoWindow()
        }
        else {
          m.hideInfoWindow()
        }
      })
      
    },
    addMarkerIcon(marker, poi) {
      //TODO icon map somewhere in settings
      const iconMap = {
        stolperstein: "starofdavid",
        winkel: "shop",
        vliegtuig: "plane",
        start: "start",
        cafe: "coffee",
        restaurant: "restaurant"
      };

      if (poi.tags) {
        let icon = "pin";
        if (poi.start) {
          icon = "start"
        }
        else if (poi.routePoint) {
          // no special markers, but add index to image (?)
        }
        else if (Array.isArray(poi.tags)) {
          for (let tagIndex = 0; tagIndex < poi.tags.length; tagIndex++) {
            const tag = poi.tags[tagIndex].toLowerCase().trim();
            console.log("tag", tag);
            if (tag && iconMap[tag]) {
              icon = iconMap[tag];
              break;
            }
          }
        }
        if (icon) {
          // TODO cache?
          const iconImg = new Image();

          if (isIOS) {
            //iconImg.imageSource = ImageSource.fromResourceSync(icon);
            //console.log(`LOADING > ~/assets/images/markers/${icon}@0.75x.png`);
            iconImg.imageSource = ImageSource.fromFileSync(
              `~/assets/images/markers/${icon}@0.75x.png`
            );
          } else {
            // in android the resources are too big, so just using two sizes...
            //console.log(`LOADING > ~/assets/images/markers/${icon}@1.5x.png`);
            iconImg.imageSource = ImageSource.fromFileSync(
              `~/assets/images/markers/${icon}@1.5x.png`
            );
          }

          marker.icon = iconImg;
        }
      }
    },

    addMarkerFromPoi(poi, idx) {
      const poiMarker = new Marker();
      poiMarker.position = Position.positionFromLatLng(
        poi.position.latitude,
        poi.position.longitude
      );
      if (poi.routePoint) {
        poiMarker.title = `${idx + 1}. ${poi.title}`;
      }
      else {
        poiMarker.title = poi.title;
      }
      poiMarker.userData = Object.assign({poiIndex: idx}, poi)
      this.mapView.addMarker(poiMarker);

      return poiMarker;
    },
    // TODO determine if some initialized params can be stored in VUEX (since opening modals/closing re-renders stuff and also repositions map sometimes...)
    onMapReady(args) {
      this.mapView = args.object;
      console.log("what is zoom?", this.mapView.zoom);
      // workaround for sizing the map correctly, at least on iOS
      setTimeout(
        () =>
          (this.mapView.height = {
            unit: "%",
            value: 0.999
          }),
        1
      );

      this.initMapSettings()

      this.addMapMarkers()

      this.addPaths()

      this.$emit("mapReady");
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
    pointWithinBounds(poi) {
      let bounds = this.mapView.projection.visibleRegion.bounds
      let pos = Position.positionFromLatLng(poi.position.latitude, poi.position.longitude)
      if (isAndroid) {
        return bounds.android.contains(pos)
      }
      else if (isIOS) {
        return bounds.ios.containsCoordinate(pos)
      }
    },
    animateToPoint(poi, padding, zoomLevel) {
      padding = padding || 40;
      zoomLevel = zoomLevel || 11;
      if (!poi) 
        return

      if (isIOS) {

        let locationToSet = CLLocationCoordinate2DMake(poi.position.latitude, poi.position.longitude);
        let updateLocationCamera = GMSCameraUpdate.setTargetZoom(locationToSet, zoomLevel);

        this.mapView.gMap.animateWithCameraUpdate(updateLocationCamera);
      }
      if (isAndroid) {

        let cpBuilder = new com.google.android.gms.maps.model.CameraPosition.Builder();
        cpBuilder.target(
           new com.google.android.gms.maps.model.LatLng(poi.position.latitude, poi.position.longitude)
        )
        cpBuilder.zoom(zoomLevel);
        let cameraUpdate = com.google.android.gms.maps.CameraUpdateFactory.newCameraPosition(cpBuilder.build());
        if (this.mapAnimationsEnabled) {
          this.mapView.gMap.animateCamera(cameraUpdate);
        }
        else {
          this.gMap.moveCamera(cameraUpdate);
        }
      }
    },
    addPaths() {
      // create route line
      if (this.paths && this.paths.length) {
        this.mapView.removeAllShapes();

        this.paths.forEach( path => {
          
          // draw the polyline
          const polyline = new Polyline();
          console.log("creating a line...", path.length);
          path.forEach(geoPoint => {
            const pos = Position.positionFromLatLng(
              geoPoint.latitude,
              geoPoint.longitude
            );
            polyline.addPoint(pos);
          });
          polyline.visible = true;
          polyline.width = 5;
          polyline.geodesic = false;
          polyline.color = new Color("#141f17");
          this.mapView.addPolyline(polyline);
        })
      }
    },
    addMapMarkers() {
      console.log(
        " ADDING POINTS: " + (this.pois ? this.pois.length : "EMPTY")
      );
      let bounds;
      let padding = 40;
      if (isIOS) {
        bounds = GMSCoordinateBounds.alloc().init();
      }

      this.mapView.removeAllMarkers();

      if (this.pois && this.pois.length) {
        let poiIndex = 0
        this.markers = []
        this.pois.forEach(poi => {
          const marker = this.addMarkerFromPoi(poi, poiIndex);
          this.markers.push(marker)
          if (isIOS) bounds = bounds.includingCoordinate(marker.position);
          this.addMarkerIcon(marker, poi);
          poiIndex++
        });

        // This positions the camera on a box around the points
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
          console.log("ANDROID moving map to bounds of all points on map");
          this.mapView.gMap.animateCamera(cu);
        }
        if (isIOS) {
          var update = GMSCameraUpdate.fitBoundsWithPadding(bounds, padding);
          console.log("IOS moving map to bounds of all points on map");
          // setting timeout... https://github.com/dapriett/nativescript-google-maps-sdk/issues/106
          setTimeout(() => {
            this.mapView.gMap.animateWithCameraUpdate(update);
          }, 100)
        }
      }

      // END map positioning
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

<style lang="scss" scoped>
GoogleMap {
  padding-bottom:100;
}
</style>
