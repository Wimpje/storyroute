<template>
  <StackLayout width="100%" height="100%" @loaded="onLoaded">
    <MapView
      :latitude="latitude"
      :longitude="longitude"
      :zoom="zoom"
      :bearing="bearing"
      :tilt="tilt"
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
import { MapView, Marker, Position, Polyline } from "nativescript-google-maps-sdk";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { mapGetters } from "vuex";
import { Color } from "tns-core-modules/color";
import mapStyles from "~/assets/mapStyles.js"

import { Image } from 'tns-core-modules/ui/image/image';
import { ImageSource } from "tns-core-modules/image-source";


export default {
  props: ["pois", "currentPoi", "path"],
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
   
  },
  methods: {
    onLoaded() {
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
                      that.zoom = 10;
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
                that.zoom = 10;
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
    getPoints() {
      this.addMarkersFromPois(this.pois);
    },
    addMarkerIcon(marker, poi) {
      //TODO icon map somewhere in settings
      const iconMap = {
        'stolperstein': 'starofdavid',
        //'verzet': 'resistance',
       // 'duits': 'german',
       // 'geallieerd': 'allies',
        'winkel': 'shop',
        'cafe': 'coffee',
        'restaurant': 'restaurant',

      }

      if (poi.tags) {
        let icon = 'pin'
        if (Array.isArray(poi.tags)) {
          for (let tagIndex = 0; tagIndex < poi.tags.length; tagIndex++) {
            const tag = poi.tags[tagIndex].toLowerCase().trim();
            console.log('tag', tag)
            if (tag && iconMap[tag]) {
              icon =  iconMap[tag]
              break
            }
          }
        }
        if (icon) {
          const iconImg = new Image();

          if(isIOS) {
            //iconImg.imageSource = ImageSource.fromResourceSync(icon);
            console.log(`LOADING > ~/assets/images/markers/${icon}@1.5x.png`)
            iconImg.imageSource = ImageSource.fromFileSync(`~/assets/images/markers/${icon}@2x.png`);
          }
          else {
            // in android the resources are too big, so just using two sizes... 
            console.log(`LOADING > ~/assets/images/markers/${icon}@1.5x.png`)
            iconImg.imageSource = ImageSource.fromFileSync(`~/assets/images/markers/${icon}@1.5x.png`);
          }
          
          marker.icon = iconImg
        }
      }
    },
    addMarkersFromPois(pois) {
      this.mapView.removeAllMarkers();
      this.markers = [];
      if (pois && pois.length) {
        pois.forEach(poi => {
          const marker = this.addMarkerFromPoi(poi);
          marker.poi = poi;
          this.addMarkerIcon(marker, poi)
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
      
      this.mapView.setStyle(mapStyles.retro)

      this.mapView.settings.mapToolbarEnabled = false;
      this.mapView.settings.rotateGesturesEnabled = true;
      this.mapView.settings.tiltGesturesEnabled = false;
      this.mapView.settings.myLocationEnabled = true;
      this.mapView.settings.myLocationButtonEnabled = true;
      this.mapView.settings.compassEnabled = true;
      this.mapView.settings.zoomGesturesEnabled = true;

      // can be done to hide infowindow
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


      // This positions the camera on a box around the points
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
      // END map positioning

      // create route line
      if(this.path && this.path.length) {
        this.mapView.removeAllShapes();

        // draw the polyline 
        const polyline = new Polyline();
        console.log('want to create a line...', this.path.length)
        
        this.path.forEach(geoPoint => {
          const pos = Position.positionFromLatLng(geoPoint.latitude, geoPoint.longitude)
          polyline.addPoint(pos);
        })
        polyline.visible = true;
        polyline.width = 5;
        polyline.geodesic = false;
        polyline.color = new Color("#8ABF5F");
        this.mapView.addPolyline(polyline);
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
