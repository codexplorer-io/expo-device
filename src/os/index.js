import { Platform } from 'react-native';

export const OS = {
    isIOS: () => Platform.OS === 'ios',
    isAndroid: () => Platform.OS === 'android',
    version: () => Platform.Version
};
