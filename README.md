# 🐾 Momoy Pet Supplies – Mobile App

This repository contains the React Native mobile app for **Momoy Pet Supplies**.

---

## Prerequisites

Before running the commands, make sure you have:

- **Node.js** → version 18 or later

```bash
  node -v
  npm -v
  npx -v
  yarn -v
```

Run this in the folder where you want your React Native project created:

```bash
  npx @react-native-community/cli@latest init mobile --version 0.81.1
```

- mobile → name of your project (change if needed)

- --version 0.81.1 → pins React Native to the latest stable version

This will create a new folder structure:

```bash
  /mobile
  ├── android/
  ├── ios/
  ├── app.json
  ├── package.json
  └── ...
```

Running the App on Android (without Android Studio)

1. Enable Developer Options + USB Debugging on your phone.

2. Connect your phone via USB.

3. Verify the connection:

```bash
  adb devices
```

- If you see your device → connected.

4. Start the Metro bundler:

- NPM

```bash
  npm start
```

- NPX

```bash
  npx react-native start
```

- YARN

```bash
  yarn start
```

5. In another terminal, install & run the app:

- NPM

```bash
  npm run android
```

- NPX

```bash
  npx react-native run-android
```

- YARN

```bash
  yarn android
```

---

## Installation Dependencies & Folder Structure

Step 1: Create folders inside

```bash
  mobile/
  ├── src/
  │   ├── components/     # Reusable UI components (buttons, inputs, cards, etc.)
  │   ├── screens/        # Each screen of the app (Home, Products, Cart, etc.)
  │   ├── navigation/     # Navigation (stack, tabs, drawer)
  │   ├── hooks/          # Custom React hooks (e.g. useAuth, useProducts)
  │   ├── context/        # Context providers (auth, theme, cart)
  │   └── services/       # Helpers, constants, API calls
  └── App.tsx
```

Step 2: Install Dependencies

```bash
  npm install axios
  npm install react-native-screens
  npm install react-native-reanimated
  npm install react-native-worklets

  npm install react-native-navigation-bar-color@latest
  npm install @react-native-community/checkbox@latest
  npm install react-native-maps@latest
  npm install react-native-config@latest
```

Step 3: Install Navigation (Tabs and Stack)

```bash
  npm install @react-navigation/native
```

- Bottom Tabs

```bash
  npm install @react-navigation/bottom-tabs
```

- Stack

```bash
  npm install @react-navigation/native-stack
```

---

## Set up dotenv

1. Install dotenv

```bash
  npm install react-native-dotenv
```

2. Create a **.env** file

```ini
  API_KEYS=copypastehere
```

3. Update **babel.config.ts** to include:

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],

  // Add this plugins
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
```

4. Create a type declaration file

```bash
  touch env.d.ts
```

5. Add this content to **env.d.ts**

```ts
declare module '@env' {
  export const API_URL: string;
  // add other variables from your .env file if you have more
}
```

6. Import your this in **./src/services/api.ts**

```ts
import { API_URL } from '@env';
```

7. Restart\Clear Metro Bundler

```bash
  npm start -c
  # or
  npx react-native start --reset-cache
```

---

## Screen Portrait

1. Copy this **android:screenOrientation="portrait"**

2. Find and Open the file name **AndroidManifest.xml**

```bash
  android/
  ├── app/
      ├── src/
          ├── main/
              ├── AndroidManifest.xml
```

3. Paste it inside of this file

```xml
  <manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
      android:supportsRtl="true">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true"

        android:screenOrientation="portrait" // Paster it here
        >
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

---

## Geolocation Service

- Package to check and request location permission

```bash
  npm install @react-native-community/geolocation@latest
  npm install react-native-permissions
  npm install react-native-android-location-enabler
```

- Permisison in **AndroidManifest.xml**

1. Go to **android/app/src/main/AndroidManifest.xml**
2. Copy and paste this

```xml
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

**ACCESS_FINE_LOCATION** -> precise location
**ACCESS_COARSE_LOCATION** -> approximate location
**ACCESS_BACKGROUND_LOCATION** -> background location (Android 10+ required)

- Import this in **AllowLocationScreen**

```tsx
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
```

---

## APK File

---

## Git

Instead of using main to push all the changes create a new branch develop, it's for active work and keep the main stable.

1. Create **develop** branch from main

```bash
  git checkout -b develop main

  git push origin develop
```

Now you have:

- **main** -> contains your currnet latest code.
- **develop** -> will be used for ongoing work.

Now your repo has:

- **main** -> stable branch.
- **develop** -> working branch for all new changes.

Stay on **develop** for active coding

```bash
  git checkout develop
```

2. Create a feature or design branch

```bash
  git checkout -b design/cart-ui
```

if you're on another branch say (main) but want to base your new branch on **develop**:

```bash
  git checkout -b design/cart-ui develop
```

3. Make changes -> commit -> push

- Make Changes

```bash
  git add .
```

- Commit

```bash
  git commit -m "design: added cart screen UI"
```

- Push

```bash
  git push origin desgin/cart-ui
```

4. Merge that branch back into **develop** when finished

- Switch to **develop** branch

```bash
  git checkout develop
```

- Merge your **design/cart-ui** branch to your **develop** branch

```bash
  git merge design/cart-ui
```

- Push to your **develop** branch

```bash
  git push origin develop
```

5. When everything in **develop** is tested and ready for release, update **main**

- Switch to **main**

```bash
  git checkout main
```

- Merge your **develop** branch to your **main**

```bash
  git merge develop
```

- Push to your **main**

```bash
  git push origin main
```

---

## npm install react-native-send-intent@latest
