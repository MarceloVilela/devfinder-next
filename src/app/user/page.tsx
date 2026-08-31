import type { Metadata } from 'next';

import { fetchJSON } from '../../lib/fetchJSON';
import { UserData } from '../../hooks/auth';
import UserTabs from '../_components/UserTabs';
import UserAll from '../_components/UserAll';

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

  const { docs, total, itemsPerPage } = await fetchJSON<DevsFeed>(`/devs?page=${currentPage}`, {
    next: { revalidate: 60 * 60 * 8 },
  });

  return (
    <UserTabs>
      <UserAll docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} page={currentPage} />
    </UserTabs>
  );
}
