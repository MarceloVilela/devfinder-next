'use client';

import React, { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// @ts-ignore
import 'react-toastify/dist/ReactToastify.css';

import { store } from '../store';
import { useAppDispatch } from '../store/hooks';
import { hydrateAuth } from '../hooks/auth';
import { hydrateTheme } from '../hooks/styleSwitcher';
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
        <SiteChrome>{children}</SiteChrome>
        <ToastContainer />
      </Hydrator>
    </ReduxProvider>
  );
}
