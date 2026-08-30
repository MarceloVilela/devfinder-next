'use client';

import React, { ReactNode } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-ignore
import 'react-tabs/style/react-tabs.css';

import { useAuth } from '../../hooks/auth';
import { Footer, Header } from '../../components';
import Subs from './Subs';
import ContainerFullWidth from '../video/style';

interface HomeFeedProps {
  children: ReactNode;
}

export default function HomeFeed({ children }: HomeFeedProps) {
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
            {children}
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
