'use client';

import React, { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { useAuth } from '../../hooks/auth';
import { Container } from '../../components';
import UserLiked from './UserLiked';
import UserDisliked from './UserDisliked';

interface UserTabsProps {
  children: ReactNode;
}

export default function UserTabs({ children }: UserTabsProps) {
  const { user, isHydrated } = useAuth();
  const isLoggedIn = isHydrated && !!(user && user._id);

  return (
    <Container loading={false}>
      {isHydrated &&
        <Tabs.Root className="wrap-tabs-inline" defaultValue="start">
          <Tabs.List className="tab-list">
            <Tabs.Trigger className="tab-trigger" value="start">Início</Tabs.Trigger>
            {isLoggedIn &&
              <>
                <Tabs.Trigger className="tab-trigger" value="liked">Favoritados</Tabs.Trigger>
                <Tabs.Trigger className="tab-trigger" value="disliked">Não seguidos</Tabs.Trigger>
              </>
            }
          </Tabs.List>

          <Tabs.Content value="start">
            {children}
          </Tabs.Content>

          {isLoggedIn &&
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
      }
    </Container>
  );
}
