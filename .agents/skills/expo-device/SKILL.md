---
name: expo-device
description: Instructions for using @codexporer.io/expo-device for OS identification, device info, and screen orientation detection in Expo and React Native applications.
---

# `@codexporer.io/expo-device` Skill

## Overview
`@codexporer.io/expo-device` handles device hardware inspection (phone vs tablet), platform OS detection helpers (`OS`), and screen orientation management hooks backed by `react-sweet-state`.

---

## Peer Dependencies

All peer dependencies must be installed in consuming projects:
- `react`: `*`
- `react-native`: `*`
- `expo-device`: `*`
- `expo-screen-orientation`: `*`
- `react-sweet-state`: `*`

---

## When to Use
- Differentiating between phone and tablet layouts (e.g. 2-column vs 4-column photo grids).
- Checking platform-specific behavior (`OS.isIOS()`, `OS.isAndroid()`, `OS.version()`).
- Listening for screen orientation changes to adapt layouts and canvas views.
- Locking/unlocking screen rotation programmatically.

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
Object providing platform detection methods:

| Method | Return | Description |
| :--- | :--- | :--- |
| `OS.isIOS()` | `boolean` | `true` if iOS platform |
| `OS.isAndroid()` | `boolean` | `true` if Android platform |
| `OS.version()` | `string \| number` | OS version identifier (`Platform.Version`) |

### `useDeviceInfo()`
Returns `[DeviceInfoState, DeviceInfoActions]`.

#### `DeviceInfoState`
| Property | Type | Description |
| :--- | :--- | :--- |
| `isPhone` | `boolean \| undefined` | Phone form factor |
| `isTablet` | `boolean \| undefined` | Tablet form factor |
| `modelName` | `string \| null \| undefined` | Hardware model string |

#### `DeviceInfoActions`
| Action | Signature | Description |
| :--- | :--- | :--- |
| `initialize` | `() => Promise<void>` | Inspects hardware and populates device info |

### `useScreenOrientation()`
Returns `[ScreenOrientationState, ScreenOrientationActions]`.

#### `ScreenOrientationState`
| Property | Type | Description |
| :--- | :--- | :--- |
| `isLandscape` | `boolean \| undefined` | Landscape orientation flag |
| `screenOrientation` | `ScreenOrientation.Orientation \| undefined` | Active Expo Orientation enum value |

#### `ScreenOrientationActions`
| Action | Signature | Description |
| :--- | :--- | :--- |
| `initialize` | `(options?: { setDefaultScreenOrientation?: Promise<void> }) => Promise<void>` | Initializes orientation store and reads current orientation |
| `lockScreenOrientation` | `(options?: { orientationLock?: ScreenOrientation.OrientationLock }) => Promise<void>` | Locks device to specified orientation lock |
| `unlockScreenOrientation` | `() => Promise<void>` | Restores dynamic rotation |
| `setDefaultScreenOrientation` | `() => Promise<void>` | Resets orientation to system default |
| `setState` | `(state: Partial<ScreenOrientationState>) => void` | Directly updates orientation state |

### Additional Exported Hooks
- `useDeviceInfoActions()`: Returns `[null, DeviceInfoActions]` for dispatching without re-rendering.
- `useScreenOrientationActions()`: Returns `[null, ScreenOrientationActions]`.
- `useScreenOrientationChangeListener()`: Attaches `ScreenOrientation.addOrientationChangeListener` to synchronize orientation changes.

---

## Critical Rules & Guidelines
1. **Initialize at Boot**: Call `await initialize()` during root bootstrap so `isTablet`, `isPhone`, and `modelName` are available.
2. **Mount Orientation Listener**: Mount `useScreenOrientationChangeListener()` once in the root app to automatically sync orientation updates.
3. **`OS` Helper are Functions**: Always call `OS.isIOS()` and `OS.isAndroid()` as functions, not boolean properties.
4. **Orientation State Fields**: State only provides `isLandscape` and `screenOrientation`. For portrait, check `!isLandscape`.
