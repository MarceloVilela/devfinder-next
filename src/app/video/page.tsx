import type { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchJSON } from '../../lib/fetchJSON';
import { VideoData } from '../../types';
import HomeFeed from '../_components/HomeFeed';

export const metadata: Metadata = {
  title: 'Vídeos',
};

interface TrendingFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

export default async function VideoListPage() {
  const { docs, total, itemsPerPage } = await fetchJSON<TrendingFeed>('/feed/trending?page=1', {
    next: { revalidate: 60 * 60 * 8 },
  });

  return (
    <Suspense fallback={null}>
      <HomeFeed docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
    </Suspense>
  );
}
