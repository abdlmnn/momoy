# 🐾 Momoy Pet Supplies – Mobile App

This repository contains the React Native mobile app for **Momoy Pet Supplies**.  
Backend and mobile code are managed in a single monorepo for easier collaboration.

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

## Set up Tabs Navigations & Folders

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

6. Import your code in **./src/services/api.ts**

```ts
import { API_URL } from '@env';
```

7. Restart\Clear Metro Bundler

```bash
  npm start -c
  # or
  npx react-native start --reset-cache
```

--

android:screenOrientation="portrait"
