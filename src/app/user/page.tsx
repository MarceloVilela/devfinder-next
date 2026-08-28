import type { Metadata } from 'next';

import { fetchJSON } from '../../lib/fetchJSON';
import { UserData } from '../../hooks/auth';
import { Header, Footer } from '../../components';
import UserTabs from '../_components/UserTabs';

export const metadata: Metadata = {
  title: 'Usuários',
};

interface DevsFeed {
  docs: UserData[];
  total: number;
  itemsPerPage: number;
}

export default async function UserListPage() {
  const { docs, total, itemsPerPage } = await fetchJSON<DevsFeed>('/devs?page=1', {
    next: { revalidate: 60 * 60 * 8 },
  });

  return (
    <>
      <Header />
      <UserTabs docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
      <Footer />
    </>
  );
}
