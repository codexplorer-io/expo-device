import * as ScreenOrientation from 'expo-screen-orientation';

export declare const OS: {
    isIOS: () => boolean;
    isAndroid: () => boolean;
    version: () => string | number;
};

export interface DeviceInfoState {
    isPhone: boolean | undefined;
    isTablet: boolean | undefined;
    modelName: string | null | undefined;
}

export interface DeviceInfoActions {
    initialize: () => Promise<void>;
}

export declare const useDeviceInfo: () => [DeviceInfoState, DeviceInfoActions];
export declare const useDeviceInfoActions: () => [null, DeviceInfoActions];

export interface ScreenOrientationState {
    screenOrientation: ScreenOrientation.Orientation | undefined;
    isLandscape: boolean | undefined;
}

export interface ScreenOrientationActions {
    initialize: (options?: { setDefaultScreenOrientation?: Promise<void> }) => Promise<void>;
    setDefaultScreenOrientation: () => Promise<void>;
    lockScreenOrientation: (options?: { orientationLock?: ScreenOrientation.OrientationLock }) => Promise<void>;
    unlockScreenOrientation: () => Promise<void>;
    setState: (state: Partial<ScreenOrientationState>) => void;
}

export declare const useScreenOrientation: () => [ScreenOrientationState, ScreenOrientationActions];
export declare const useScreenOrientationActions: () => [null, ScreenOrientationActions];
export declare const useScreenOrientationChangeListener: () => void;
