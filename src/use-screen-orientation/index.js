import { useEffect } from 'react';
import { createStore, createHook } from 'react-sweet-state';
import * as ScreenOrientation from 'expo-screen-orientation';
import { di } from 'react-magnetic-di';

const { Orientation } = ScreenOrientation;

const isLandscape = screenOrientation => screenOrientation === Orientation.LANDSCAPE_LEFT ||
    screenOrientation === Orientation.LANDSCAPE_RIGHT;

const setScreenOrientation = screenOrientation => ({ setState }) => {
    setState({
        screenOrientation,
        isLandscape: isLandscape(screenOrientation)
    });
};

export const Store = createStore({
    initialState: {
        screenOrientation: undefined,
        isLandscape: undefined
    },
    actions: {
        initialize: () => async ({ dispatch }) => {
            let screenOrientation = Orientation.PORTRAIT_DOWN;
            try {
                screenOrientation = await ScreenOrientation.getOrientationAsync();
                // eslint-disable-next-line no-empty
            } catch { }

            dispatch(setScreenOrientation(screenOrientation));
        },
        setScreenOrientation,
        unlockScreenOrientation: () => () => ScreenOrientation.unlockAsync()
    },
    name: 'ScreenOrientation'
});

export const useScreenOrientation = createHook(Store);

export const useScreenOrientationActions = createHook(Store, { selector: null });

export const useScreenOrientationChangeListener = () => {
    di(useEffect, useScreenOrientationActions);

    const [, { setScreenOrientation }] = useScreenOrientationActions();

    useEffect(() => {
        const subscription = ScreenOrientation.addOrientationChangeListener(
            ({ orientationInfo }) => {
                setScreenOrientation(orientationInfo.orientation);
            }
        );

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, [setScreenOrientation]);
};
