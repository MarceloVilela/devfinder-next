import type { Metadata } from 'next';

import { fetchListing, ListingFeed, LISTING_UNAVAILABLE_MESSAGE } from '../../lib/fetchListing';
import { COLD_START_TIMEOUT_MS } from '../../lib/fetchJSON';
import { UserData } from '../../hooks/auth';
import { FeedbackMessage } from '../../components';
import UserTabs from '../_components/UserTabs';
import UserAll from '../_components/UserAll';

export const metadata: Metadata = {
  title: 'Usuários',
};

// Ver comentário em app/page.tsx (acompanha COLD_START_TIMEOUT_MS).
export const maxDuration = 60;

// Sem `searchParams` nem `cookies()` — ver comentário em app/page.tsx (mesma reversão de M1,
// etapa 2 v3).
export default async function UserListPage() {
  // .catch() local (não em fetchListing) pra proteger só a 1ª geração da rota — ver comentário
  // em lib/fetchListing.ts e em app/page.tsx.
  const devs = await fetchListing<ListingFeed<UserData>>('/devs?page=1', {
    next: { revalidate: 60 * 60 * 8 },
    timeoutMs: COLD_START_TIMEOUT_MS,
  }).catch(() => null);

  if (!devs) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  const { docs, total, itemsPerPage } = devs;

  return (
    <UserTabs>
      <UserAll docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
    </UserTabs>
  );
}
