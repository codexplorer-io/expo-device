# AGENTS.md - `@codexporer.io/expo-device` Instructions

## Package Overview
`@codexporer.io/expo-device` handles device hardware inspection (phone vs tablet), OS detection helpers (`OS`), and orientation state hooks (`useScreenOrientation`).

## Key Exports
- `OS`: `isIOS()`, `isAndroid()`, `version()`
- `useDeviceInfo()`: returns `[{ isTablet, isPhone }, { initialize }]`
- `useDeviceInfoActions()`: returns actions object containing `{ initialize }`
- `useScreenOrientation()`: returns `[{ isLandscape, isPortrait, orientation }, actions]`
- `useScreenOrientationActions()`: returns actions for orientation store
- `useScreenOrientationChangeListener()`: sets up orientation change subscriber

## Critical Guidelines for AI Agents
- Call `initialize()` via `useDeviceInfoActions()` or `useDeviceInfo()` at application boot to determine tablet vs phone form factor.
- Use `OS.isAndroid()` or `OS.isIOS()` for platform checks.
- Use `isTablet` from `useDeviceInfo()` to drive responsive grid, column count, and tablet layout adaptations.
- Use `useScreenOrientationChangeListener()` at root to automatically keep orientation state updated during rotation.
