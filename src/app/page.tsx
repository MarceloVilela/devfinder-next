import type { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchJSON } from '../lib/fetchJSON';
import { VideoData } from '../types';
import HomeFeed from './_components/HomeFeed';

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

export default async function HomePage() {
  const { docs, total, itemsPerPage } = await fetchJSON<TrendingFeed>('/feed/trending?page=1', {
    next: { revalidate: 60 * 60 * 8 },
  });

  return (
    <Suspense fallback={null}>
      <HomeFeed docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
    </Suspense>
  );
}
