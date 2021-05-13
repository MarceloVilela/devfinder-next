import { resetIdCounter } from 'react-tabs';

import api from '../services/api';
import Main from './video';
import { TrendProps } from './video/Trend'

export default function HomePage({ docsStatic, totalStatic, itemsPerPageStatic }: TrendProps) {
  return (
    <>
      <Main docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
    </>
  )
};

export async function getStaticProps() {
  resetIdCounter();

  const { data } = await api.get('/feed/trending', { params: { page: 1 } })
  const { docs, total, itemsPerPage } = data;

  return {
    props: {
      docsStatic: docs,
      totalStatic: total,
      itemsPerPageStatic: itemsPerPage
    },
    revalidate: 60 * 60 * 8,
  }
}