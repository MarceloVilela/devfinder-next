'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { Container } from '../../components';
import { TAB_TRIGGER_CLASSNAME } from './tabTriggerClassName';

interface UserTabsProps {
  children: ReactNode;
  isLoggedIn: boolean;
  liked?: ReactNode;
  disliked?: ReactNode;
}

// Client Component só pela interatividade das abas (Radix Tabs) — não busca dado nem decide
// visibilidade via `useAuth()`/`isHydrated` (achado 4, etapa 2 v3: isso fazia a aba "Início",
// pública, também esperar hidratação sem necessidade). `isLoggedIn` chega pronto do Server
// Component pai (user/page.tsx), calculado a partir do cookie de sessão — estável entre
// servidor e cliente, sem risco de mismatch de hidratação. `liked`/`disliked` chegam como
// árvore já resolvida (Server Components), não como componentes importados aqui.
export default function UserTabs({ children, isLoggedIn, liked, disliked }: UserTabsProps) {
  return (
    <Container loading={false}>
      <Tabs.Root defaultValue="start">
        <Tabs.List className="flex border-0 list-none">
          <Tabs.Trigger
            className={TAB_TRIGGER_CLASSNAME}
            value="start"
          >
            Início
          </Tabs.Trigger>
          {isLoggedIn &&
            <>
              <Tabs.Trigger
                className={TAB_TRIGGER_CLASSNAME}
                value="liked"
              >
                Favoritados
              </Tabs.Trigger>
              <Tabs.Trigger
                className={TAB_TRIGGER_CLASSNAME}
                value="disliked"
              >
                Não seguidos
              </Tabs.Trigger>
            </>
          }
        </Tabs.List>

        <Tabs.Content value="start">
          {children}
        </Tabs.Content>

        {isLoggedIn &&
          <>
            <Tabs.Content value="liked">
              {liked}
            </Tabs.Content>
            <Tabs.Content value="disliked">
              {disliked}
            </Tabs.Content>
          </>
        }
      </Tabs.Root>
    </Container>
  );
}
