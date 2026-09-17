import type { Metadata } from 'next';

import { fetchJSON } from '../../lib/fetchJSON';
import { getSessionToken } from '../../lib/fetchSessionJSON';
import { UserData } from '../../hooks/auth';
import UserTabs from '../_components/UserTabs';
import UserAll from '../_components/UserAll';
import UserLiked from '../_components/UserLiked';
import UserDisliked from '../_components/UserDisliked';

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

  const token = await getSessionToken();

  const [{ docs, total, itemsPerPage }, liked, disliked] = await Promise.all([
    fetchJSON<DevsFeed>(`/devs?page=${currentPage}`, {
      next: { revalidate: 60 * 60 * 8 },
    }),
    token ? UserLiked({ token }) : undefined,
    token ? UserDisliked({ token }) : undefined,
  ]);

  return (
    <UserTabs
      isLoggedIn={!!token}
      liked={liked}
      disliked={disliked}
    >
      <UserAll docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </UserTabs>
  );
}
