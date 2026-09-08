import type { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchJSON } from '../lib/fetchJSON';
import { getSessionToken } from '../lib/fetchSessionJSON';
import { VideoData } from '../types';
import HomeFeed from './_components/HomeFeed';
import Trend from './_components/Trend';
import Subs, { SubsSkeleton } from './_components/Subs';

// A "/" coincide com o segmento do root layout — o `template` de título definido lá
// não se aplica ao próprio segmento que o declara (comportamento documentado do Next.js),
// por isso o título completo é montado aqui explicitamente.
export const metadata: Metadata = {
  title: `Home | ${process.env.NEXT_PUBLIC_TITLE ?? 'DevFinder'}`,
};

interface TrendingFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

interface PageProps {
  // `page` pagina a aba "Explorar" (Trend); `subsPage` pagina a aba "Inscrições" (Subs) —
  // chaves diferentes na mesma rota pra não colidir (achado 5, etapa 2 v3, ver Paginate).
  searchParams: Promise<{ page?: string; subsPage?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { page, subsPage } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentSubsPage = Number(subsPage) || 1;

  const [{ docs, total, itemsPerPage }, token] = await Promise.all([
    fetchJSON<TrendingFeed>(`/feed/trending?page=${currentPage}`, {
      next: { revalidate: 60 * 60 * 8 },
    }),
    getSessionToken(),
  ]);

  return (
    <HomeFeed
      isLoggedIn={!!token}
      subs={token && (
        <Suspense fallback={<SubsSkeleton />}>
          <Subs token={token} page={currentSubsPage} />
        </Suspense>
      )}
    >
      <Trend docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </HomeFeed>
  );
}
