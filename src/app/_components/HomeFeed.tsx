'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import ContainerFullWidth from '../video/style';
import { TAB_TRIGGER_CLASSNAME } from './tabTriggerClassName';

interface HomeFeedProps {
  children: ReactNode;
  isLoggedIn: boolean;
  subs?: ReactNode;
}

// Ver comentário equivalente em UserTabs.tsx.
export default function HomeFeed({ children, isLoggedIn, subs }: HomeFeedProps) {
  return (
    <ContainerFullWidth className="container-full-width" loading={false}>
      <Tabs.Root defaultValue="explore">
        {/* `tab-list`: token exigido por app/video/style.css (`.video-list-shell .tab-list`,
           regra de padding mobile) — este é o único Tabs.List envolvido por `.video-list-shell`
           (via ContainerFullWidth), então só aqui, não em UserTabs.tsx. */}
        <Tabs.List className="tab-list flex border-0 list-none">
          <Tabs.Trigger
            className={TAB_TRIGGER_CLASSNAME}
            value="explore"
          >
            Explorar
          </Tabs.Trigger>
          {isLoggedIn &&
            <Tabs.Trigger
              className={TAB_TRIGGER_CLASSNAME}
              value="subs"
            >
              Inscrições
            </Tabs.Trigger>
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
