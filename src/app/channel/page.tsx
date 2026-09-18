import type { Metadata } from 'next';

import { fetchListing, LISTING_UNAVAILABLE_MESSAGE } from '../../lib/fetchListing';
import { ChannelData } from '../../types';
import { FeedbackMessage } from '../../components';
import ChannelCategories from '../_components/ChannelCategories';

export const metadata: Metadata = {
  title: 'Canais',
};

export default async function ChannelListPage() {
  const channels = await fetchListing<ChannelData[]>('/channels', {
    next: { revalidate: 60 * 60 * 8 },
  });

  if (!channels) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  return <ChannelCategories channelsStatic={channels} />;
}
