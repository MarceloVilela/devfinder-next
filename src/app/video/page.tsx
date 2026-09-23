import type { Metadata } from 'next';

import { fetchListing, ListingFeed, LISTING_UNAVAILABLE_MESSAGE, LISTING_COLD_START_TIMEOUT_MS } from '../../lib/fetchListing';
import { VideoData } from '../../types';
import { FeedbackMessage } from '../../components';
import HomeFeed from '../_components/HomeFeed';
import Trend from '../_components/Trend';

export const metadata: Metadata = {
  title: 'Vídeos',
};

// Ver comentário em app/page.tsx (acompanha LISTING_COLD_START_TIMEOUT_MS).
export const maxDuration = 60;

// Sem `searchParams` nem `cookies()` — ver comentário em app/page.tsx (mesma reversão de M1,
// etapa 2 v3; esta rota é a mesma listagem de trending que "/", só numa URL própria).
export default async function VideoListPage() {
  const trend = await fetchListing<ListingFeed<VideoData>>('/feed/trending?page=1', {
    next: { revalidate: 60 * 60 * 8 },
    timeoutMs: LISTING_COLD_START_TIMEOUT_MS,
  }).catch(() => null);

  if (!trend) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  const { docs, total, itemsPerPage } = trend;

  return (
    <HomeFeed>
      <Trend docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
    </HomeFeed>
  );
}
