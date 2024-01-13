import React from 'react';
import { mountWithDi } from '@codexporer.io/react-test-utils';
import assign from 'lodash/assign';
import * as Device from 'expo-device';
import {
    Store,
    useDeviceInfo,
    useDeviceInfoActions
} from './index';

const { DeviceType } = Device;

jest.mock('expo-device', () => ({
    ...jest.requireActual('expo-device'),
    getDeviceTypeAsync: jest.fn(),
    modelName: 'modelNameMock'
}));

describe('Device info', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have actions and initial state', () => {
        const { initialState, actions } = Store;
        expect(initialState).toStrictEqual({
            isPhone: undefined,
            isTablet: undefined
        });
        expect(actions).toStrictEqual({
            initialize: expect.any(Function)
        });
    });

    describe('initialize', () => {
        const createMocks = ({ deviceType, shouldFail = false }) => {
            if (shouldFail) {
                Device.getDeviceTypeAsync.mockReturnValue(Promise.reject());
            } else {
                Device.getDeviceTypeAsync.mockReturnValue(Promise.resolve(deviceType));
            }

            const { initialState, actions: { initialize } } = Store;
            const thunk = initialize();
            const state = { ...initialState };
            const setState = jest.fn(newState => assign(state, newState));
            const getState = jest.fn(() => state);
            const dispatch = fn => fn({ setState, getState, dispatch });

            return {
                initialState,
                setState,
                getState,
                execute: () => thunk({ setState, getState, dispatch })
            };
        };

        it('should initialize Phone', async () => {
            const { execute, setState } = createMocks({
                deviceType: DeviceType.PHONE
            });

            await execute();

            expect(Device.getDeviceTypeAsync).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenNthCalledWith(1, {
                isPhone: true,
                isTablet: false,
                modelName: 'modelNameMock'
            });
        });

        it('should initialize Tablet', async () => {
            const { execute, setState } = createMocks({
                deviceType: DeviceType.TABLET
            });

            await execute();

            expect(Device.getDeviceTypeAsync).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenNthCalledWith(1, {
                isPhone: false,
                isTablet: true,
                modelName: 'modelNameMock'
            });
        });

        it('should initialize unknown when unknown is returned', async () => {
            const { execute, setState } = createMocks({
                deviceType: DeviceType.UNKNOWN
            });

            await execute();

            expect(Device.getDeviceTypeAsync).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenNthCalledWith(1, {
                isPhone: false,
                isTablet: false,
                modelName: 'modelNameMock'
            });
        });

        it('should initialize unknown when failure', async () => {
            const { execute, setState } = createMocks({ shouldFail: true });

            await execute();

            expect(Device.getDeviceTypeAsync).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenNthCalledWith(1, {
                isPhone: false,
                isTablet: false,
                modelName: 'modelNameMock'
            });
        });
    });

    describe('useDeviceInfo', () => {
        it('should return data', () => {
            const { initialState } = Store;
            let hookResult = null;
            const HookRenderer = () => {
                [hookResult] = useDeviceInfo();
                return null;
            };

            mountWithDi(<HookRenderer />);

            expect(hookResult).toStrictEqual(initialState);
        });
    });

    describe('useDeviceInfoActions', () => {
        it('should not return data', () => {
            let hookResult = {};
            const HookRenderer = () => {
                [hookResult] = useDeviceInfoActions();
                return null;
            };

            mountWithDi(<HookRenderer />);

            expect(hookResult).toBeUndefined();
        });
    });
});
