# Story Route

> Tell stories with geolocation

## Usage

``` bash
# Install dependencies
npm install

# Preview on device
tns preview

# Build, watch for changes and run the application
tns run

# Build, watch for changes and debug the application
tns debug <platform>

# Build for production
tns build <platform> --env.production

```

## NS 8 upgrade notes
- I had to modify some gradle / podfile stuff
node_modules/@nativescript/firebase/platforms/ios/podfile > set ios to 13.0
app_resources/platforms/android/before-plugins.gradle, set:
```
ext {
  googlePlayServicesVersion = "16.+"
}
```
Also do this: https://stackoverflow.com/questions/64886369/nativescript-ios-build-fails-xcode-error-command-ld-failed-with-a-nonzero-exi 
