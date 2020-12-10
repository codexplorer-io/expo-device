import { createStore, createHook } from 'react-sweet-state';
import * as Device from 'expo-device';

const { DeviceType } = Device;

export const Store = createStore({
    initialState: {
        isPhone: undefined,
        isTablet: undefined
    },
    actions: {
        initialize: () => async ({ setState }) => {
            let deviceType;
            try {
                deviceType = await Device.getDeviceTypeAsync();
                // eslint-disable-next-line no-empty
            } catch { }

            setState({
                isPhone: deviceType === DeviceType.PHONE,
                isTablet: deviceType === DeviceType.TABLET
            });
        }
    },
    name: 'DeviceInfo'
});

export const useDeviceInfo = createHook(Store);

export const useDeviceInfoActions = createHook(Store, { selector: null });
