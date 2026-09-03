# `@codexporer.io/expo-device`

Device info state store, orientation listener, and OS helper utility for React Native and Expo applications.

## Prerequisites

Ensure `expo-device`, `expo-screen-orientation`, `react-sweet-state`, and `deprecated-react-native-prop-types` are installed in your workspace:

```bash
npx expo install expo-device expo-screen-orientation
yarn add react-sweet-state deprecated-react-native-prop-types
```

## Initialization & Usage Example

Always `await initializeDeviceInfo()` during app startup before rendering main application UI:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDeviceInfo, useScreenOrientation, OS } from '@codexporer.io/expo-device';

export function RootApp() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [{ isTablet, isPhone }, { initialize: initializeDeviceInfo }] = useDeviceInfo();
  const [{ isLandscape, isPortrait }] = useScreenOrientation();

  useEffect(() => {
    async function init() {
      try {
        await initializeDeviceInfo();
      } finally {
        setIsAppReady(true);
      }
    }
    init();
  }, [initializeDeviceInfo]);

  if (!isAppReady) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text>Is Tablet: {String(isTablet)}</Text>
      <Text>Is Phone: {String(isPhone)}</Text>
      <Text>Is Android: {String(OS.isAndroid())}</Text>
      <Text>Is Landscape: {String(isLandscape)}</Text>
      <Text>Is Portrait: {String(isPortrait)}</Text>
    </View>
  );
}
```