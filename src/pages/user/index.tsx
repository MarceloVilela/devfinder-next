import React from 'react';
import Head from 'next/head';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useAuth } from '../../hooks/auth'
import api from '../../services/api';
import { Header, Container, Footer } from '../../components'

import All, { UserAllProps } from './All';
import Liked from './Liked';
import Disliked from './Disliked';

export default function Main({ docsStatic, totalStatic, itemsPerPageStatic }: UserAllProps) {
  const { user } = useAuth();

  return (
    <>
      <Header />

      <Head><title>Usuários | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
      <Container loading={false}>
        <Tabs className='wrap-tabs-inline'>
          <TabList>
            <Tab>Início</Tab>
            <Tab>Favoritados</Tab>
            <Tab>Não seguidos</Tab>
          </TabList>

          <TabPanel>
            <All docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
          </TabPanel>

          <TabPanel>
            <Liked />
          </TabPanel>

          <TabPanel>
            <Disliked />
          </TabPanel>
        </Tabs>
      </Container>

      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const { data } = await api.get('/devs', { params: { page: 1 } })
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