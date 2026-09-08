import type { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchJSON } from '../../lib/fetchJSON';
import { getSessionToken } from '../../lib/fetchSessionJSON';
import { VideoData } from '../../types';
import HomeFeed from '../_components/HomeFeed';
import Trend from '../_components/Trend';
import Subs, { SubsSkeleton } from '../_components/Subs';

export const metadata: Metadata = {
  title: 'Vídeos',
};

interface TrendingFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

interface PageProps {
  // Mesma ressalva de app/page.tsx: `page` pagina Trend/Explorar, `subsPage` pagina
  // Subs/Inscrições — chaves diferentes na mesma rota.
  searchParams: Promise<{ page?: string; subsPage?: string }>;
}

export default async function VideoListPage({ searchParams }: PageProps) {
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
