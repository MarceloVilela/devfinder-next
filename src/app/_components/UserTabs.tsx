'use client';

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useAuth } from '../../hooks/auth';
import { Container } from '../../components';
import UserAll, { UserAllProps } from './UserAll';
import UserLiked from './UserLiked';
import UserDisliked from './UserDisliked';

export default function UserTabs({ docsStatic, totalStatic, itemsPerPageStatic }: UserAllProps) {
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
            <UserAll docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
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
            <>
              <UserAll docsStatic={docsStatic} totalStatic={totalStatic} itemsPerPageStatic={itemsPerPageStatic} />
            </>
          </TabPanel>
        </Tabs>
      }

    </Container>
  );
}
