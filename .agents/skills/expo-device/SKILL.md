---
name: expo-device
description: Instructions for using @codexporer.io/expo-device for OS identification, device info, and screen orientation detection in Expo and React Native applications.
---

# `@codexporer.io/expo-device` Skill

## Overview
`@codexporer.io/expo-device` provides device classification (phone vs tablet), OS helper utilities, and screen orientation listeners powered by `react-sweet-state`.

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

## Key API Capabilities

### 1. `OS` Helper
- `OS.isIOS()`: returns `true` if current platform is iOS.
- `OS.isAndroid()`: returns `true` if current platform is Android.
- `OS.version()`: returns platform OS version.

### 2. `useDeviceInfo()` Hook
- State object: `{ isTablet: boolean, isPhone: boolean }`
- Action methods: `{ initialize: () => Promise<void> }`

### 3. Screen Orientation Hooks
- `useScreenOrientation()`: Returns state `{ isLandscape: boolean, isPortrait: boolean, orientation: Orientation }`.
- `useScreenOrientationChangeListener()`: Attaches active orientation change listeners.

## Implementation Guidelines

1. **Initialization**: Always await `initialize()` during root app startup (`useEffect` in `App.tsx` or `app/_layout.tsx`) before rendering main screens.
2. **Platform Guarding**: Use `OS.isAndroid()` or `OS.isIOS()` instead of inline `Platform.OS === 'android'` checks.
3. **Adaptive UI & Tablet Layouts**: Use `isTablet` from `useDeviceInfo()` to compute responsive layout column counts, dialog max-widths, and padding.
