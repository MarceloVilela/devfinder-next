import type { Metadata } from 'next';

import { fetchListing, LISTING_UNAVAILABLE_MESSAGE } from '../../lib/fetchListing';
import { COLD_START_TIMEOUT_MS } from '../../lib/fetchJSON';
import { ChannelData } from '../../types';
import { FeedbackMessage } from '../../components';
import ChannelCategories from '../_components/ChannelCategories';

export const metadata: Metadata = {
  title: 'Canais',
};

// Ver comentário em app/page.tsx (acompanha COLD_START_TIMEOUT_MS).
export const maxDuration = 60;

export default async function ChannelListPage() {
  // .catch() local (não em fetchListing) pra proteger só a 1ª geração da rota — ver comentário
  // em lib/fetchListing.ts e em app/page.tsx.
  const channels = await fetchListing<ChannelData[]>('/channels', {
    next: { revalidate: 60 * 60 * 8 },
    timeoutMs: COLD_START_TIMEOUT_MS,
  }).catch(() => null);

  if (!channels) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  return <ChannelCategories channelsStatic={channels} />;
}
