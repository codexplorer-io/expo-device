# `@codexporer.io/expo-device`

Hardware inspection, device type classification (phone vs tablet), OS detection helpers, and screen orientation management for React Native and Expo applications.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-device
```

Peer dependencies:
- `react` (`*`)
- `react-native` (`*`)
- `react-sweet-state` (`*`)
- `expo-device` (`*`)
- `expo-screen-orientation` (`*`)

## Quick Start

### 1. App Startup Initialization

Initialize device info and register the screen orientation change listener during root application bootstrap:

```tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  useDeviceInfoActions,
  useScreenOrientationChangeListener
} from '@codexporer.io/expo-device';

export function RootApp({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [, { initialize: initializeDeviceInfo }] = useDeviceInfoActions();

  // Keep screen orientation state updated on rotation
  useScreenOrientationChangeListener();

  useEffect(() => {
    initializeDeviceInfo().then(() => setIsReady(true));
  }, [initializeDeviceInfo]);

  if (!isReady) {
    return <ActivityIndicator size="large" />;
  }

  return <>{children}</>;
}
```

### 2. Device Form Factor & Platform Checks

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import {
  useDeviceInfo,
  useScreenOrientation,
  OS
} from '@codexporer.io/expo-device';

export function ResponsiveView() {
  const [{ isTablet, isPhone, modelName }] = useDeviceInfo();
  const [{ isLandscape, screenOrientation }] = useScreenOrientation();

  return (
    <View style={{ padding: 16 }}>
      <Text>Device Model: {modelName}</Text>
      <Text>Type: {isTablet ? 'Tablet (iPad/Android Tab)' : 'Phone'}</Text>
      <Text>Platform: {OS.isIOS() ? 'Apple iOS' : 'Android'}</Text>
      <Text>OS Version: {OS.version()}</Text>
      <Text>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</Text>
    </View>
  );
}
```

## API Reference

### `OS` Helper Object

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `OS.isIOS()` | `boolean` | Returns `true` if current operating system is iOS |
| `OS.isAndroid()` | `boolean` | Returns `true` if current operating system is Android |
| `OS.version()` | `string \| number` | Returns OS version identifier |

### `useDeviceInfo()`
Returns `[DeviceInfoState, DeviceInfoActions]`.

#### `DeviceInfoState`

| Property | Type | Description |
| :--- | :--- | :--- |
| `isPhone` | `boolean \| undefined` | `true` if the device is a phone form factor |
| `isTablet` | `boolean \| undefined` | `true` if the device is an iPad or Android tablet |
| `modelName` | `string \| null \| undefined` | Hardware model string (e.g., `'iPhone 15 Pro'`) |

#### `DeviceInfoActions`

| Action | Signature | Description |
| :--- | :--- | :--- |
| `initialize` | `() => Promise<void>` | Inspects hardware via `expo-device` and updates state |

### `useScreenOrientation()`
Returns `[ScreenOrientationState, ScreenOrientationActions]`.

#### `ScreenOrientationState`

| Property | Type | Description |
| :--- | :--- | :--- |
| `isLandscape` | `boolean \| undefined` | `true` when viewport is in landscape mode |
| `screenOrientation` | `ScreenOrientation.Orientation \| undefined` | Active Expo ScreenOrientation enum value |

#### `ScreenOrientationActions`

| Action | Signature | Description |
| :--- | :--- | :--- |
| `initialize` | `(options?) => Promise<void>` | Initializes orientation store and reads initial orientation |
| `lockScreenOrientation` | `(options?) => Promise<void>` | Locks device to specified orientation lock |
| `unlockScreenOrientation` | `() => Promise<void>` | Restores dynamic rotation |
| `setDefaultScreenOrientation` | `() => Promise<void>` | Resets orientation to system default |

### Hooks

- `useDeviceInfoActions()`: Returns `[null, DeviceInfoActions]` for components that only dispatch actions without subscribing to re-renders.
- `useScreenOrientationActions()`: Returns `[null, ScreenOrientationActions]`.
- `useScreenOrientationChangeListener()`: Sets up the native subscription listener for device rotation events.

## License

MIT