## Release Key

-- create a key
C:\Users\abdul\momoy> keytool -genkey -v -keystore "C:\Users\abdul\momoy\release-key.jks" -alias myappkey -keyalg RSA -keysize 2048 -validity 10000

-- get a ash release
C:\Users\abdul\momoy> keytool -list -v -keystore "C:\Users\abdul\momoy\release-key.jks" -alias myappkey
