# AGENTS.md — `@codexporer.io/expo-device` Instructions

## Package Overview
`@codexporer.io/expo-device` handles device hardware inspection (phone vs tablet), platform OS detection helpers (`OS`), and screen orientation management hooks backed by `react-sweet-state`.

## Peer Dependencies
All peer dependencies must be installed in consuming projects:
- `react`: `*`
- `react-native`: `*`
- `expo-device`: `*`
- `expo-screen-orientation`: `*`
- `react-sweet-state`: `*`

## Key Exports
- `OS`: Helper object with functions `isIOS(): boolean`, `isAndroid(): boolean`, and `version(): string | number` (maps to `Platform.Version`).
- `useDeviceInfo()`: Hook returning `[{ isPhone, isTablet, modelName }, { initialize }]`.
- `useDeviceInfoActions()`: Hook returning `[null, { initialize }]`.
- `useScreenOrientation()`: Hook returning `[{ screenOrientation, isLandscape }, { initialize, setDefaultScreenOrientation, lockScreenOrientation, unlockScreenOrientation, setState }]`.
- `useScreenOrientationActions()`: Hook returning `[null, ScreenOrientationActions]`.
- `useScreenOrientationChangeListener()`: Hook subscribing to `ScreenOrientation.addOrientationChangeListener` to sync rotation updates to the store.

## Critical Guidelines for AI Agents
- **`OS` Helper are Methods**: Always invoke `OS.isIOS()` and `OS.isAndroid()` as functions (e.g. `OS.isIOS()`, not `OS.isIOS`).
- **Screen Orientation Properties**: The state holds `isLandscape: boolean | undefined` and `screenOrientation: Orientation | undefined`. There is **NO `isPortrait`** property; check `!isLandscape` for portrait orientation.
- **Bootstrapping**: Call `initialize()` via `useDeviceInfoActions()` during application bootstrap so `isTablet`, `isPhone`, and `modelName` are populated.
- **Orientation Listener**: Mount `useScreenOrientationChangeListener()` once at root to automatically keep orientation state updated during device rotations.
- **Action Dispatching**: When a component only needs to trigger orientation locks or initialization without needing re-renders on state changes, use `useDeviceInfoActions()` or `useScreenOrientationActions()`.
