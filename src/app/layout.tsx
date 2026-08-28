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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
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
