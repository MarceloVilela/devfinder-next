'use client';

import React, { ReactNode } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useAuth } from '../../hooks/auth';
import { Container } from '../../components';
import UserLiked from './UserLiked';
import UserDisliked from './UserDisliked';

interface UserTabsProps {
  children: ReactNode;
}

export default function UserTabs({ children }: UserTabsProps) {
  const { user, isHydrated } = useAuth();

  return (
    <Container loading={false}>

      {isHydrated && (user && user._id) &&
        <Tabs className='wrap-tabs-inline'>
          <TabList>
            <Tab>Início</Tab>
            <Tab>Favoritados</Tab>
            <Tab>Não seguidos</Tab>
          </TabList>

          <TabPanel>
            {children}
          </TabPanel>

          <TabPanel>
            <UserLiked />
          </TabPanel>

          <TabPanel>
            <UserDisliked />
          </TabPanel>
        </Tabs>
      }

      {isHydrated && (!user || !user._id) &&
        <Tabs className='wrap-tabs-inline'>
          <TabList>
            <Tab>Início</Tab>
          </TabList>

          <TabPanel>
            {children}
          </TabPanel>
        </Tabs>
      }

    </Container>
  );
}
