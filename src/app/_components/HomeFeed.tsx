'use client';

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-ignore
import 'react-tabs/style/react-tabs.css';

import { useAuth } from '../../hooks/auth';
import { Footer, Header } from '../../components';
import Subs from './Subs';
import Trend, { TrendProps } from './Trend';
import ContainerFullWidth from '../video/style';

export default function HomeFeed({ docsStatic, totalStatic, itemsPerPageStatic }: TrendProps) {
  const { user, isHydrated } = useAuth();

  return (
    <>
      <Header />

      <ContainerFullWidth className="container-full-width" loading={false}>
        <Tabs className='wrap-tabs-inline'>
          <TabList>
            <Tab>Explorar</Tab>
            {isHydrated && (user && user._id) &&
              <Tab>Inscrições</Tab>
            }
          </TabList>

          <TabPanel>
            <>
              <Trend docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
            </>
          </TabPanel>
          {isHydrated && (user && user._id) &&
            <TabPanel>
              <Subs />
            </TabPanel>
          }
        </Tabs>
      </ContainerFullWidth>

      <Footer />
    </>
  );
}
