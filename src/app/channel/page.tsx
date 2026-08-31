import type { Metadata } from 'next';

import { fetchJSON } from '../../lib/fetchJSON';
import { ChannelData } from '../../types';
import ChannelCategories from '../_components/ChannelCategories';

export const metadata: Metadata = {
  title: 'Canais',
};

export default async function ChannelListPage() {
  const channels = await fetchJSON<ChannelData[]>('/channels', {
    next: { revalidate: 60 * 60 * 8 },
  });

  return <ChannelCategories channelsStatic={channels} />;
}
