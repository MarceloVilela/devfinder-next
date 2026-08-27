import React, { Fragment, ReactNode, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { store } from '../store';
import { useAppDispatch } from '../store/hooks';
import { hydrateAuth } from './auth';
import { hydrateTheme, useStyleSwitcher } from './styleSwitcher';
import { night, day } from '../styles/Theme'
import GlobalStyle from '../styles/GlobalStyle';

interface AppProviderProps {
    children: ReactNode;
}

export type ThemeType = typeof night;

const Hydrator: React.FC<AppProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(hydrateAuth());
        dispatch(hydrateTheme());
    }, [dispatch]);

    return <>{children}</>;
}

const StyledProvider: React.FC<AppProviderProps> = ({ children }) => {
    const { alias, isHydrated } = useStyleSwitcher();

    // Durante hidratação, sempre usar 'dark' para evitar mismatch
    const themeAlias = isHydrated ? alias : 'dark';
    const theme = themeAlias === 'dark' ? night : day

    return (
        <ThemeProvider theme={theme}>

            <Fragment>
                {children}
                <GlobalStyle />
            </Fragment>

        </ThemeProvider>
    );
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <ReduxProvider store={store}>

            <Hydrator>
                <StyledProvider>
                    {children}
                </StyledProvider>
            </Hydrator>

        </ReduxProvider>
    );
}

export default AppProvider;
