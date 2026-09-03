# AGENTS.md - `@codexporer.io/expo-device` Instructions

## Package Overview
`@codexporer.io/expo-device` handles device hardware inspection (phone vs tablet), OS detection helpers (`OS`), and orientation state hooks (`useScreenOrientation`).

## API Specifications

### Exports
- `OS`: `isIOS()`, `isAndroid()`, `version()`
- `useDeviceInfo()`: returns `[{ isTablet, isPhone }, { initialize }]`
- `useDeviceInfoActions()`: returns actions object containing `{ initialize }`
- `useScreenOrientation()`: returns `[{ isLandscape, isPortrait, orientation }, actions]`
- `useScreenOrientationActions()`: returns actions for orientation store
- `useScreenOrientationChangeListener()`: sets up orientation change subscriber

## Best Practices
- Call `await initializeDeviceInfo()` at application boot phase.
- Use `OS.isAndroid()` for platform checks.
- Use `isTablet` to drive responsive grid and layout changes.
