---
name: expo-device
description: Instructions for using @codexporer.io/expo-device for OS identification, device info, and screen orientation detection in Expo and React Native applications.
---

# `@codexporer.io/expo-device` Skill

## Overview
`@codexporer.io/expo-device` provides device classification (phone vs tablet), OS helper utilities, and screen orientation listeners powered by `react-sweet-state` for React Native & Expo applications.

---

## Primary Exports

```typescript
import { 
  OS, 
  useDeviceInfo, 
  useDeviceInfoActions, 
  useScreenOrientation, 
  useScreenOrientationActions,
  useScreenOrientationChangeListener
} from '@codexporer.io/expo-device';
```

---

## Initialization Pattern

Always initialize device info at application startup (e.g. in `app/_layout.tsx` or `App.tsx`) before main screens mount:

```typescript
import React, { useEffect, useState } from 'react';
import { useDeviceInfo } from '@codexporer.io/expo-device';

export function RootInitializer() {
  const [, { initialize: initializeDeviceInfo }] = useDeviceInfo();

  useEffect(() => {
    async function init() {
      await initializeDeviceInfo();
    }
    init();
  }, [initializeDeviceInfo]);

  return null;
}
```

---

## Core Capabilities

### 1. `OS` Helper
Use `OS` methods instead of direct `Platform.OS` string comparisons:
- `OS.isIOS()`: returns `boolean` indicating iOS platform.
- `OS.isAndroid()`: returns `boolean` indicating Android platform.
- `OS.version()`: returns system version string or number.

```typescript
if (OS.isIOS()) {
  // iOS specific logic
}
```

### 2. `useDeviceInfo()` Hook
Returns a tuple `[state, actions]`:
- `state.isTablet`: `boolean | undefined` — whether running on a tablet/iPad.
- `state.isPhone`: `boolean | undefined` — whether running on a mobile phone.
- `state.modelName`: `string | null | undefined` — device model name.
- `actions.initialize()`: `() => Promise<void>` — initializes device detection.

```typescript
const [{ isTablet }] = useDeviceInfo();
const numColumns = isTablet ? 3 : 1;
```

### 3. Screen Orientation Hooks
- **`useScreenOrientation()`**: Returns `[{ screenOrientation, isLandscape }, actions]`.
- **`useScreenOrientationActions()`**: Returns `[null, actions]`.
- **`useScreenOrientationChangeListener()`**: Attaches active orientation change listeners to automatically update state on device rotation.

---

## Mandatory Guidelines

1. **Root Initialization**: Always await `initializeDeviceInfo()` during app bootstrapping.
2. **Platform Checks**: Prefer `OS.isAndroid()` or `OS.isIOS()` over raw `Platform.OS === '...'` checks.
3. **Adaptive Layouts**: Use `isTablet` from `useDeviceInfo()` to compute responsive layout column counts, dialog max-widths, and padding.
