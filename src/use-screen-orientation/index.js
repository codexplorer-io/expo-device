import { useEffect } from 'react';
import { createStore, createHook } from 'react-sweet-state';
import * as ScreenOrientation from 'expo-screen-orientation';
import { di } from 'react-magnetic-di';

const { Orientation } = ScreenOrientation;

const isLandscape = screenOrientation => screenOrientation === Orientation.LANDSCAPE_LEFT ||
    screenOrientation === Orientation.LANDSCAPE_RIGHT;

export const Store = createStore({
    initialState: {
        screenOrientation: undefined,
        isLandscape: undefined
    },
    actions: {
        initialize: ({ setDefaultScreenOrientation } = {}) => async ({ setState }) => {
            let screenOrientation = Orientation.PORTRAIT_DOWN;
            try {
                screenOrientation = await ScreenOrientation.getOrientationAsync();
                // eslint-disable-next-line no-empty
            } catch { }

            setState({
                screenOrientation,
                isLandscape: isLandscape(screenOrientation),
                setDefaultScreenOrientation: setDefaultScreenOrientation ?? Promise.resolve()
            });
        },
        setDefaultScreenOrientation: () => ({
            getState
        }) => getState().setDefaultScreenOrientation(),
        lockScreenOrientation: ({
            orientationLock
        } = {}) => () => ScreenOrientation.lockAsync(
            orientationLock ?? ScreenOrientation.OrientationLock.DEFAULT
        ),
        unlockScreenOrientation: () => () => ScreenOrientation.unlockAsync(),
        setState: state => ({ setState }) => setState(state)
    },
    name: 'ScreenOrientation'
});

export const useScreenOrientation = createHook(Store);

export const useScreenOrientationActions = createHook(Store, { selector: null });

export const useScreenOrientationChangeListener = () => {
    di(useEffect, useScreenOrientationActions);

    const [, { setState }] = useScreenOrientationActions();

    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener(
            ({ orientationInfo }) => {
                setState({
                    screenOrientation: orientationInfo.orientation,
                    isLandscape: isLandscape(orientationInfo.orientation)
                });
            }
        );

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, [setState]);
};
