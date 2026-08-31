'use client';

import React, { Fragment, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
import { Header, Footer } from '../components';

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
  const { alias } = useStyleSwitcher();

  // Sem risco de mismatch de hidratação aqui: as cores reais vêm das variáveis CSS estáticas em
  // styles/GlobalStyle.ts, escolhidas pelo atributo data-theme (script bloqueante em
  // app/layout.tsx) — nenhum styled-component gera CSS a partir de props.theme.*, então o valor
  // deste theme prop não influencia o HTML renderizado em nenhuma das duas passadas (servidor e
  // cliente); ele só precisa existir para satisfazer a tipagem DefaultTheme.
  const theme = alias === 'dark' ? night : day;

  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        {children}
        <GlobalStyle />
      </Fragment>
    </ThemeProvider>
  );
};

// login é a única rota sem o chrome (Header/Footer) — tela cheia, sem busca/navegação.
const ROUTES_WITHOUT_CHROME = ['/login'];

// Fica aqui (acima de {children}, dentro do layout raiz que nunca desmonta entre navegações)
// em vez de em cada page.tsx: o Header carrega a barra de busca via import dinâmico
// (ssr:false, ver components/Header/index.tsx) — se ele fosse remontado a cada troca de rota
// (como era, um <Header /> por page.tsx), a barra sumiria e voltava a cada navegação.
const SiteChrome: React.FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();

  if (pathname && ROUTES_WITHOUT_CHROME.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <Hydrator>
        <StyledProvider>
          <SiteChrome>{children}</SiteChrome>
          <ToastContainer />
        </StyledProvider>
      </Hydrator>
    </ReduxProvider>
  );
}
