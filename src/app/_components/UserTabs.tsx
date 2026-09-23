'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { Container } from '../../components';
import { useAuth, isLoggedIn } from '../../hooks/auth';
import { TAB_TRIGGER_CLASSNAME } from './tabTriggerClassName';
import UserLiked from './UserLiked';
import UserDisliked from './UserDisliked';

interface UserTabsProps {
  children: ReactNode;
}

// Decide a visibilidade de "Favoritados"/"Não seguidos" via `useAuth()`/`isHydrated` de novo
// (reversão consciente de M1, etapa 2 v3): sessão vive em cookie httpOnly, e o axios
// (`services/api.ts`) já manda esse cookie sozinho — não precisa mais de `cookies()` no Server
// Component pai (`user/page.tsx`) só pra isso. Ler `cookies()` (ou `searchParams`, ver
// Trend.tsx) ali forçava a rota inteira a renderização dinâmica, acoplando a listagem pública ao
// cold start do Render (ver CLAUDE.md "Dados externos"). Cuidado com o achado 4 daquela etapa: a
// aba pública "Início" continua renderizada incondicionalmente abaixo, nunca atrás de
// `isHydrated` — só "Favoritados"/"Não seguidos" (e o próprio fetch, dentro de
// UserLiked/UserDisliked) esperam a hidratação confirmar a sessão.
export default function UserTabs({ children }: UserTabsProps) {
  const { user, isHydrated } = useAuth();
  const showSessionTabs = isHydrated && isLoggedIn(user);

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
          {showSessionTabs &&
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

        {showSessionTabs &&
          <>
            <Tabs.Content value="liked">
              <UserLiked />
            </Tabs.Content>
            <Tabs.Content value="disliked">
              <UserDisliked />
            </Tabs.Content>
          </>
        }
      </Tabs.Root>
    </Container>
  );
}
