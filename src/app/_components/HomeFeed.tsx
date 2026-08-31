'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { useAuth } from '../../hooks/auth';
import Subs from './Subs';
import ContainerFullWidth from '../video/style';

interface HomeFeedProps {
  children: ReactNode;
}

export default function HomeFeed({ children }: HomeFeedProps) {
  const { user, isHydrated } = useAuth();
  const hasSubscriptionsTab = isHydrated && !!(user && user._id);

  return (
    <ContainerFullWidth className="container-full-width" loading={false}>
      <Tabs.Root className="wrap-tabs-inline" defaultValue="explore">
        <Tabs.List className="tab-list">
          <Tabs.Trigger className="tab-trigger" value="explore">Explorar</Tabs.Trigger>
          {hasSubscriptionsTab &&
            <Tabs.Trigger className="tab-trigger" value="subs">Inscrições</Tabs.Trigger>
          }
        </Tabs.List>

        <Tabs.Content value="explore">
          {children}
        </Tabs.Content>
        {hasSubscriptionsTab &&
          <Tabs.Content value="subs">
            <Subs />
          </Tabs.Content>
        }
      </Tabs.Root>
    </ContainerFullWidth>
  );
}
