import React from 'react';
import Head from 'next/head';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { useAuth } from '../../hooks/auth';
import { TrendProps } from './Trend';
import { Footer, Header } from '../../components'
import Subs from './Subs';
import Trend from './Trend';
import ContainerFullWidth from './style'

export interface VideoData {
  _id: string;
  title: string;
  url: string;
  channel_id: string;
  channel: string;
  channel_url: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Main({ docsStatic, totalStatic, itemsPerPageStatic }: TrendProps) {
  const { user } = useAuth();

  return (
    <>
      <Header />

      <Head><title>Home | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
      <ContainerFullWidth className="container-full-width" loading={false}>
        <Tabs className='wrap-tabs-inline'>
          <TabList>
            <Tab>Explorar</Tab>
            {(user && user._id) &&
              <Tab>Inscrições</Tab>
            }

          </TabList>

          <TabPanel>
            <>
              <Trend docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
            </>
          </TabPanel>
          {(user && user._id) &&
            <TabPanel>
              <Subs />
            </TabPanel>
          }
        </Tabs>
      </ContainerFullWidth>

      <Footer />
    </>
  )
}