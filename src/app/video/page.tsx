import type { Metadata } from 'next';

import { fetchListing, ListingFeed, LISTING_UNAVAILABLE_MESSAGE } from '../../lib/fetchListing';
import { getSessionToken } from '../../lib/fetchSessionJSON';
import { VideoData } from '../../types';
import { FeedbackMessage } from '../../components';
import HomeFeed from '../_components/HomeFeed';
import Trend from '../_components/Trend';
import Subs from '../_components/Subs';

export const metadata: Metadata = {
  title: 'Vídeos',
};

interface PageProps {
  // Mesma ressalva de app/page.tsx: `page` pagina Trend/Explorar, `subsPage` pagina
  // Subs/Inscrições — chaves diferentes na mesma rota.
  searchParams: Promise<{ page?: string; subsPage?: string }>;
}

export default async function VideoListPage({ searchParams }: PageProps) {
  const { page, subsPage } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentSubsPage = Number(subsPage) || 1;

  const token = await getSessionToken();

  const [trend, subs] = await Promise.all([
    fetchListing<ListingFeed<VideoData>>(`/feed/trending?page=${currentPage}`, {
      next: { revalidate: 60 * 60 * 8 },
    }),
    token ? Subs({ token, page: currentSubsPage }) : undefined,
  ]);

  if (!trend) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  const { docs, total, itemsPerPage } = trend;

  return (
    <HomeFeed
      isLoggedIn={!!token}
      subs={subs}
    >
      <Trend docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </HomeFeed>
  );
}
