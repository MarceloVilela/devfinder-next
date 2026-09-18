import type { Metadata } from 'next';

import { fetchListing } from '../../lib/fetchListing';
import { ChannelData } from '../../types';
import ChannelCategories from '../_components/ChannelCategories';

export const metadata: Metadata = {
  title: 'Canais',
};

export default async function ChannelListPage() {
  const channels = await fetchListing<ChannelData[]>('/channels', {
    next: { revalidate: 60 * 60 * 8 },
  });

  return <ChannelCategories channelsStatic={channels} />;
}
