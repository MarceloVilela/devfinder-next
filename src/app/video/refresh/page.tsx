import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RefreshClient from './_components/RefreshClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

// Sem sistema de papéis no backend (`GET /me` não expõe role/isAdmin) — gate por capability URL
// (mesmo padrão de ferramenta interna sem controle de acesso real): sem VIDEO_REFRESH_TOKEN
// configurado, ou token da URL não confere, devolve 404 real em vez de abrir a ferramenta.
export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!process.env.VIDEO_REFRESH_TOKEN || token !== process.env.VIDEO_REFRESH_TOKEN) {
    notFound();
  }

  return <RefreshClient />;
}
