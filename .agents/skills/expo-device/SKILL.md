---
name: expo-device
description: Instructions for using @codexporer.io/expo-device for OS identification, device info, and screen orientation detection in Expo and React Native applications.
---

# `@codexporer.io/expo-device` Skill

## Overview
`@codexporer.io/expo-device` handles device hardware inspection (phone vs tablet), OS detection helpers (`OS`), and orientation state hooks (`useScreenOrientation`) backed by `react-sweet-state`.

---

## When to Use
- Differentiating between phone and tablet layouts (e.g. 2-column vs 4-column photo grids).
- Checking platform specific behavior (`OS.isIOS()`, `OS.isAndroid()`).
- Listening for screen orientation changes to adapt canvas sizes.

---

## Required Setup

Initialize during app startup:

```tsx
import React, { useEffect } from 'react';
import {
  useDeviceInfoActions,
  useScreenOrientationChangeListener
} from '@codexporer.io/expo-device';

export function DeviceInitializer() {
  const [, { initialize }] = useDeviceInfoActions();
  useScreenOrientationChangeListener();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
```

---

## Usage Example

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useDeviceInfo, useScreenOrientation, OS } from '@codexporer.io/expo-device';

export function ResponsiveLayout() {
  const [{ isTablet, isPhone }] = useDeviceInfo();
  const [{ isLandscape }] = useScreenOrientation();

  const numColumns = isTablet ? (isLandscape ? 6 : 4) : 2;

  return (
    <View style={{ padding: 16 }}>
      <Text>Columns: {numColumns}</Text>
      <Text>Platform: {OS.isAndroid() ? 'Android' : 'iOS'}</Text>
    </View>
  );
}
```

---

## API Reference

### `OS` Helper
| Method | Return | Description |
| :--- | :--- | :--- |
| `OS.isIOS()` | `boolean` | `true` if iOS |
| `OS.isAndroid()` | `boolean` | `true` if Android |
| `OS.version()` | `string \| number` | OS version string/number |

### `useDeviceInfo()`
Returns `[DeviceInfoState, DeviceInfoActions]`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `isPhone` | `boolean \| undefined` | Phone form factor |
| `isTablet` | `boolean \| undefined` | Tablet form factor |
| `modelName` | `string \| null \| undefined` | Hardware model string |

### `useScreenOrientation()`
Returns `[ScreenOrientationState, ScreenOrientationActions]`.

| Property | Type | Description |
| :--- | :--- | :--- |
| `isLandscape` | `boolean \| undefined` | Landscape orientation flag |
| `screenOrientation` | `ScreenOrientation.Orientation` | Expo Orientation enum |

---

## Critical Rules & Guidelines
1. **Initialize at Boot**: Call `await initialize()` during root bootstrap so `isTablet` and `isPhone` are available.
2. **Mount Orientation Listener**: Mount `useScreenOrientationChangeListener()` once in the root app to automatically sync orientation updates.
