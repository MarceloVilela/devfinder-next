'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import ContainerFullWidth from '../video/style';

interface HomeFeedProps {
  children: ReactNode;
  isLoggedIn: boolean;
  subs?: ReactNode;
}

// Ver comentário equivalente em UserTabs.tsx.
export default function HomeFeed({ children, isLoggedIn, subs }: HomeFeedProps) {
  return (
    <ContainerFullWidth className="container-full-width" loading={false}>
      <Tabs.Root className="wrap-tabs-inline" defaultValue="explore">
        <Tabs.List className="tab-list">
          <Tabs.Trigger className="tab-trigger" value="explore">Explorar</Tabs.Trigger>
          {isLoggedIn &&
            <Tabs.Trigger className="tab-trigger" value="subs">Inscrições</Tabs.Trigger>
          }
        </Tabs.List>

        <Tabs.Content value="explore">
          {children}
        </Tabs.Content>
        {isLoggedIn &&
          <Tabs.Content value="subs">
            {subs}
          </Tabs.Content>
        }
      </Tabs.Root>
    </ContainerFullWidth>
  );
}
