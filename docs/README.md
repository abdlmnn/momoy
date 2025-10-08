## Release Key

-- create a key
C:\Users\abdul\momoy> keytool -genkey -v -keystore "C:\Users\abdul\momoy\android\app\release-key.jks" -alias myappkey -keyalg RSA -keysize 2048 -validity 10000

-- get a ash release
C:\Users\abdul\momoy> keytool -list -v -keystore "C:\Users\abdul\momoy\android\app\release-key.jks" -alias myappkey

## Debug key

--

C:\Users\abdul\momoy> keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000

-- Sha1

keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android

## Release apk

cd android

./gradlew clean (OPTIONAL)

./gradlew assembleRelease

## Install on device or emulator

adb install -r android/app/build/outputs/apk/release/app-release.apk
