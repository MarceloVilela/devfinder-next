import type { Metadata } from 'next';

import { fetchJSON } from '../lib/fetchJSON';
import { VideoData } from '../types';
import HomeFeed from './_components/HomeFeed';
import Trend from './_components/Trend';

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
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { docs, total, itemsPerPage } = await fetchJSON<TrendingFeed>(`/feed/trending?page=${currentPage}`, {
    next: { revalidate: 60 * 60 * 8 },
  });

  return (
    <HomeFeed>
      <Trend docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </HomeFeed>
  );
}
