'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import ContainerFullWidth from '../video/style';
import { useAuth, isLoggedIn } from '../../hooks/auth';
import { TAB_TRIGGER_CLASSNAME } from './tabTriggerClassName';
import Subs from './Subs';

interface HomeFeedProps {
  children: ReactNode;
}

// Decide a visibilidade da aba "Inscrições" via `useAuth()`/`isHydrated` de novo (reversão
// consciente de M1, etapa 2 v3 — ver comentário equivalente em UserTabs.tsx): a aba pública
// "Explorar" não depende disso, só é renderizada incondicionalmente abaixo, então não volta o
// achado 4 daquela etapa (página inteira esperando hidratação). O único custo aceito é a aba
// "Inscrições" aparecer um instante depois do primeiro paint pra quem está logado, em vez de já
// vir pronta no HTML.
export default function HomeFeed({ children }: HomeFeedProps) {
  const { user, isHydrated } = useAuth();
  const showSubsTab = isHydrated && isLoggedIn(user);

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
          {showSubsTab &&
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
        {showSubsTab &&
          <Tabs.Content value="subs">
            <Subs />
          </Tabs.Content>
        }
      </Tabs.Root>
    </ContainerFullWidth>
  );
}
