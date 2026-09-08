import type { Metadata } from 'next';
import { Suspense } from 'react';

import { fetchJSON } from '../../lib/fetchJSON';
import { getSessionToken } from '../../lib/fetchSessionJSON';
import { UserData } from '../../hooks/auth';
import UserTabs from '../_components/UserTabs';
import UserAll from '../_components/UserAll';
import UserLiked, { UserLikedSkeleton } from '../_components/UserLiked';
import UserDisliked, { UserDislikedSkeleton } from '../_components/UserDisliked';

export const metadata: Metadata = {
  title: 'Usuários',
};

interface DevsFeed {
  docs: UserData[];
  total: number;
  itemsPerPage: number;
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UserListPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const [{ docs, total, itemsPerPage }, token] = await Promise.all([
    fetchJSON<DevsFeed>(`/devs?page=${currentPage}`, {
      next: { revalidate: 60 * 60 * 8 },
    }),
    getSessionToken(),
  ]);

  return (
    <UserTabs
      isLoggedIn={!!token}
      liked={token && (
        <Suspense fallback={<UserLikedSkeleton />}>
          <UserLiked token={token} />
        </Suspense>
      )}
      disliked={token && (
        <Suspense fallback={<UserDislikedSkeleton />}>
          <UserDisliked token={token} />
        </Suspense>
      )}
    >
      <UserAll docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </UserTabs>
  );
}
