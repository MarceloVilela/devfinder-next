'use client';

import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { useAuth, isLoggedIn } from '../../hooks/auth';
import { UserData } from '../../types';
import { Container, UserItemSkeleton } from '../../components';
import { UndoableUserCard } from './UndoableUserCard';
import { SessionErrorFallback } from './SessionErrorFallback';

const PLACEHOLDER_COUNT = 6;

// Client Component (voltou a ser CSR — ver comentário equivalente em Subs.tsx/UserLiked.tsx).
export default function UserDisliked() {
  const { user, isHydrated } = useAuth();
  const loggedIn = isHydrated && isLoggedIn(user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [docs, setDocs] = useState<UserData[]>([]);

  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    api.get<UserData[]>('/dislikes/devs')
      .then(({ data }) => {
        if (cancelled) return;
        setDocs(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [loggedIn]);

  if (error) {
    return <SessionErrorFallback message="Não foi possível carregar sua lista de não seguidos agora." />;
  }

  return (
    <Container unstylized className="container-full-width">
      <ul className="users list-flex-row list-none">
        {loading
          ? Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <UserItemSkeleton key={index} />
          ))
          : docs.map((user) => (
            <UndoableUserCard
              key={user._id}
              user={user}
              endpoint={`/dislikes/devs/${user.user}`}
              successMessage={`${user.user} saiu de: Não seguidos`}
              errorFallback="Erro ao desfazer."
              kind="dislike"
            />
          ))}
      </ul>
    </Container>
  );
}
