# `@codexporer.io/expo-device`

Device info state store and OS helper utility for React Native and Expo applications.

## Prerequisites

Ensure `expo-device`, `expo-screen-orientation`, `react-sweet-state`, and `deprecated-react-native-prop-types` are installed in your project root or workspace:

```bash
npx expo install expo-device expo-screen-orientation
yarn add react-sweet-state deprecated-react-native-prop-types
```

## Initialization & Usage Example

Always `await initializeDeviceInfo()` during app initialization on startup before rendering the main application UI:

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDeviceInfo, OS } from '@codexporer.io/expo-device';

export function RootApp() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [{ isTablet, isPhone }, { initialize: initializeDeviceInfo }] = useDeviceInfo();

  useEffect(() => {
    async function init() {
      try {
        // Await device info initialization along with other prerequisites
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
    </View>
  );
}
```