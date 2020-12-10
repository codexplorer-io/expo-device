import React, { useEffect } from 'react';
import { injectable } from 'react-magnetic-di';
import { mountWithDi } from '@codexporer.io/react-test-utils';
import assign from 'lodash/assign';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
    Store,
    useScreenOrientation,
    useScreenOrientationActions,
    useScreenOrientationChangeListener
} from './index';

const { Orientation } = ScreenOrientation;

jest.mock('expo-screen-orientation', () => ({
    ...jest.requireActual('expo-screen-orientation'),
    getOrientationAsync: jest.fn(),
    unlockAsync: jest.fn(),
    // eslint-disable-next-line lodash/prefer-constant
    addOrientationChangeListener: jest.fn(() => 'MOCK_SUBSCRIBER'),
    removeOrientationChangeListener: jest.fn()
}));

describe('Screen orientation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have actions and initial state', () => {
        const { initialState, actions } = Store;
        expect(initialState).toStrictEqual({
            screenOrientation: undefined,
            isLandscape: undefined
        });
        expect(actions).toStrictEqual({
            initialize: expect.any(Function),
            setScreenOrientation: expect.any(Function),
            unlockScreenOrientation: expect.any(Function)
        });
    });

    describe('initialize', () => {
        const createMocks = ({ screenOrientation, shouldFail = false }) => {
            if (shouldFail) {
                ScreenOrientation.getOrientationAsync.mockReturnValue(Promise.reject());
            } else {
                ScreenOrientation.getOrientationAsync.mockReturnValue(
                    Promise.resolve(screenOrientation)
                );
            }

            const { initialState, actions: { initialize } } = Store;
            const thunk = initialize();
            const state = { ...initialState };
            const setState = jest.fn(newState => assign(state, newState));
            const dispatch = fn => fn({ setState, dispatch });

            return {
                initialState,
                setState,
                execute: () => thunk({ setState, dispatch })
            };
        };

        it.each`
            orientation                    | description                      | isLandscape
            ${Orientation.LANDSCAPE_LEFT}  | ${'Orientation.LANDSCAPE_LEFT'}  | ${true}
            ${Orientation.LANDSCAPE_RIGHT} | ${'Orientation.LANDSCAPE_RIGHT'} | ${true}
            ${Orientation.PORTRAIT_UP}     | ${'Orientation.PORTRAIT_UP'}     | ${false}
            ${Orientation.PORTRAIT_DOWN}   | ${'Orientation.PORTRAIT_DOWN'}   | ${false}
            ${Orientation.UNKNOWN}         | ${'Orientation.UNKNOWN'}         | ${false}
        `(
            'should initialize with landscape "$isLandscape" when $description',
            async ({ orientation, isLandscape }) => {
                const { execute, setState } = createMocks({
                    screenOrientation: orientation
                });

                await execute();

                expect(ScreenOrientation.getOrientationAsync).toHaveBeenCalledTimes(1);
                expect(setState).toHaveBeenCalledTimes(1);
                expect(setState).toHaveBeenNthCalledWith(1, {
                    screenOrientation: orientation,
                    isLandscape
                });
            }
        );

        it('should initialize with orientation Orientation.PORTRAIT_DOWN when failure', async () => {
            const { execute, setState } = createMocks({ shouldFail: true });

            await execute();

            expect(ScreenOrientation.getOrientationAsync).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenCalledTimes(1);
            expect(setState).toHaveBeenNthCalledWith(1, {
                screenOrientation: Orientation.PORTRAIT_DOWN,
                isLandscape: false
            });
        });
    });

    describe('setScreenOrientation', () => {
        const createMocks = ({ screenOrientation }) => {
            const { initialState, actions: { setScreenOrientation } } = Store;
            const thunk = setScreenOrientation(screenOrientation);
            const state = { ...initialState };
            const setState = jest.fn(newState => assign(state, newState));

            return {
                initialState,
                setState,
                execute: () => thunk({ setState })
            };
        };

        it.each`
            orientation                    | description                      | isLandscape
            ${Orientation.LANDSCAPE_LEFT}  | ${'Orientation.LANDSCAPE_LEFT'}  | ${true}
            ${Orientation.LANDSCAPE_RIGHT} | ${'Orientation.LANDSCAPE_RIGHT'} | ${true}
            ${Orientation.PORTRAIT_UP}     | ${'Orientation.PORTRAIT_UP'}     | ${false}
            ${Orientation.PORTRAIT_DOWN}   | ${'Orientation.PORTRAIT_DOWN'}   | ${false}
            ${Orientation.UNKNOWN}         | ${'Orientation.UNKNOWN'}         | ${false}
        `(
            'should set landscape "$isLandscape" when $description is passed',
            ({ orientation, isLandscape }) => {
                const { execute, setState } = createMocks({
                    screenOrientation: orientation
                });

                execute();

                expect(setState).toHaveBeenCalledTimes(1);
                expect(setState).toHaveBeenNthCalledWith(1, {
                    screenOrientation: orientation,
                    isLandscape
                });
            }
        );
    });

    describe('unlockScreenOrientation', () => {
        const createMocks = ({ shouldFail = false }) => {
            if (shouldFail) {
                ScreenOrientation.unlockAsync.mockReturnValue(Promise.reject(new Error('Mock error')));
            } else {
                ScreenOrientation.unlockAsync.mockReturnValue(Promise.resolve());
            }

            const { initialState, actions: { unlockScreenOrientation } } = Store;
            const thunk = unlockScreenOrientation();

            return {
                initialState,
                execute: () => thunk()
            };
        };

        it('should call ScreenOrientation.unlockAsync', async () => {
            const { execute } = createMocks({});

            await execute();

            expect(ScreenOrientation.unlockAsync).toHaveBeenCalledTimes(1);
        });

        it('should fail when ScreenOrientation.unlockAsync fails', async () => {
            const { execute } = createMocks({ shouldFail: true });

            await expect(execute()).rejects.toThrow(new Error('Mock error'));
            expect(ScreenOrientation.unlockAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('useScreenOrientation', () => {
        it('should return data', () => {
            const { initialState } = Store;
            let hookResult = null;
            const HookRenderer = () => {
                [hookResult] = useScreenOrientation();
                return null;
            };

            mountWithDi(<HookRenderer />);

            expect(hookResult).toStrictEqual(initialState);
        });
    });

    describe('useScreenOrientationActions', () => {
        it('should not return data', () => {
            let hookResult = {};
            const HookRenderer = () => {
                [hookResult] = useScreenOrientationActions();
                return null;
            };

            mountWithDi(<HookRenderer />);

            expect(hookResult).toBeUndefined();
        });
    });

    describe('useScreenOrientationChangeListener', () => {
        const mockSetScreenOrientation = jest.fn();
        let useEffectResult;
        const mockUseEffect = jest.fn(fn => {
            useEffectResult = fn();
        });

        const deps = [
            injectable(
                useScreenOrientationActions,
                () => [undefined, { setScreenOrientation: mockSetScreenOrientation }]
            ),
            injectable(useEffect, mockUseEffect)
        ];

        beforeEach(() => {
            useEffectResult = null;
        });

        it('should call addOrientationChangeListener', () => {
            const HookRenderer = () => {
                useScreenOrientationChangeListener();
                return null;
            };

            mountWithDi(<HookRenderer />, { deps });

            expect(mockUseEffect).toHaveBeenCalledTimes(1);
            expect(ScreenOrientation.addOrientationChangeListener).toHaveBeenCalledTimes(1);
            expect(ScreenOrientation.addOrientationChangeListener).toHaveBeenCalledWith(
                expect.any(Function)
            );
            expect(ScreenOrientation.removeOrientationChangeListener).not.toHaveBeenCalled();
            expect(mockSetScreenOrientation).not.toHaveBeenCalled();
        });

        it('should call removeOrientationChangeListener when unmounted', () => {
            const HookRenderer = () => {
                useScreenOrientationChangeListener();
                return null;
            };
            mountWithDi(<HookRenderer />, { deps });

            useEffectResult();

            expect(mockUseEffect).toHaveBeenCalledTimes(1);
            expect(ScreenOrientation.addOrientationChangeListener).toHaveBeenCalledTimes(1);
            expect(ScreenOrientation.addOrientationChangeListener).toHaveBeenCalledWith(
                expect.any(Function)
            );
            expect(ScreenOrientation.removeOrientationChangeListener).toHaveBeenCalledTimes(1);
            expect(ScreenOrientation.removeOrientationChangeListener).toHaveBeenCalledWith('MOCK_SUBSCRIBER');
            expect(mockSetScreenOrientation).not.toHaveBeenCalled();
        });

        it('should call set the orientation when changed', () => {
            const HookRenderer = () => {
                useScreenOrientationChangeListener();
                return null;
            };
            mountWithDi(<HookRenderer />, { deps });
            const listener = ScreenOrientation.addOrientationChangeListener.mock.calls[0][0];

            listener({ orientationInfo: { orientation: 'MOCK_ORIENTATION' } });

            expect(mockSetScreenOrientation).toHaveBeenCalledTimes(1);
            expect(mockSetScreenOrientation).toHaveBeenCalledWith('MOCK_ORIENTATION');
        });
    });
});
