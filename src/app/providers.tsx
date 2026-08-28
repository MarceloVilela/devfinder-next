'use client';

import React, { Fragment, ReactNode, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';

import { store } from '../store';
import { useAppDispatch } from '../store/hooks';
import { hydrateAuth } from '../hooks/auth';
import { hydrateTheme, useStyleSwitcher } from '../hooks/styleSwitcher';
import { night, day } from '../styles/Theme';
import GlobalStyle from '../styles/GlobalStyle';

interface ProvidersProps {
  children: ReactNode;
}

const Hydrator: React.FC<ProvidersProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(hydrateTheme());
  }, [dispatch]);

  return <>{children}</>;
};

const StyledProvider: React.FC<ProvidersProps> = ({ children }) => {
  const { alias, isHydrated } = useStyleSwitcher();

  // Durante hidratação, sempre usar 'dark' para evitar mismatch
  const themeAlias = isHydrated ? alias : 'dark';
  const theme = themeAlias === 'dark' ? night : day;

  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        {children}
        <GlobalStyle />
      </Fragment>
    </ThemeProvider>
  );
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <Hydrator>
        <StyledProvider>
          {children}
          <ToastContainer />
        </StyledProvider>
      </Hydrator>
    </ReduxProvider>
  );
}
