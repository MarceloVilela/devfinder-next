import type { Metadata, Viewport } from 'next';

import StyledComponentsRegistry from './registry';
import Providers from './providers';

const siteTitle = process.env.NEXT_PUBLIC_TITLE ?? 'DevFinder';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/logo192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#685394',
};

// Roda de forma síncrona e bloqueante antes do primeiro paint (script comum em <head>, sem
// defer/async), lendo a preferência de tema salva (ou prefers-color-scheme, na primeira visita)
// e aplicando o atributo que styles/GlobalStyle.ts usa pra escolher entre os dois blocos
// estáticos de variáveis CSS. Elimina o flash de tema incorreto: nada de esperar hidratação do
// React/Redux (hooks/styleSwitcher.tsx faz a mesma leitura, só que depois, pra manter o estado
// do botão de alternância em app/providers.tsx sincronizado).
const themeInitScript = `(function(){try{var t=localStorage.getItem('@DevFinder:theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- regra é específica de _document.js do Pages Router; root layout do App Router é o lugar correto para <link> de fonte global */}
        <link
          href="https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
