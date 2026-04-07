import React, { Fragment, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

import { AuthProvider } from './auth';
import { StyleSwitcherProvider, useStyleSwitcher } from './styleSwitcher';
import { night, day } from '../styles/Theme'
import GlobalStyle from '../styles/GlobalStyle';

interface AppProviderProps {
    children: ReactNode;
}

export type ThemeType = typeof night;

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
        <AuthProvider>

            <StyleSwitcherProvider>
                <StyledProvider>
                    {children}
                </StyledProvider>
            </StyleSwitcherProvider>

        </AuthProvider>
    );
}

export default AppProvider;
/*

*/