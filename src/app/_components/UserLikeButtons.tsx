'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface UserLikeButtonsProps {
  userId: string;
  username: string;
}

export default function UserLikeButtons({ userId, username }: UserLikeButtonsProps) {
  const { user, setUser, isHydrated } = useAuth();
  const [pending, setPending] = useState(false);

  const includedInLike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false
    }
    return user.likes.includes(userId);
  }, [user, userId, isHydrated])

  const includedInDislike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false
    }
    return user.deslikes.includes(userId);
  }, [user, userId, isHydrated])

  async function handleUndoDislike() {
    if (!user || !user._id) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    const previousUser = user;
    setPending(true);
    setUser({ ...user, deslikes: user.deslikes.filter((id) => id !== userId) });

    try {
      await api.delete(`/dislikes/devs/${username}`);
      toast.success(`${username} saiu de: Não seguidos`);
    } catch (error) {
      setUser(previousUser);
      toast.error('Erro ao desabilitar.');
    } finally {
      setPending(false);
    }
  }

  async function handleUndoLike() {
    if (!user || !user._id) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    const previousUser = user;
    setPending(true);
    setUser({ ...user, likes: user.likes.filter((id) => id !== userId) });

    try {
      await api.delete(`/devs/${username}/likes`);
      toast.success(`${username} saiu de: Favoritos`);
    } catch (error) {
      setUser(previousUser);
      toast.error('Erro ao favoritar.');
    } finally {
      setPending(false);
    }
  }

  async function handleDislike() {
    if (!user || !user._id) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    const previousUser = user;
    setPending(true);
    setUser({ ...user, deslikes: [...user.deslikes, userId] });

    try {
      await api.post(`/dislikes/devs/${username}`);
      toast.success(`${username} foi para: Não seguidos`);
    } catch (error) {
      setUser(previousUser);
      toast.error('Erro ao desabilitar.');
    } finally {
      setPending(false);
    }
  }

  async function handleLike() {
    if (!user || !user._id) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    const previousUser = user;
    setPending(true);
    setUser({ ...user, likes: [...user.likes, userId] });

    try {
      await api.post(`/likes/devs/${username}`);
      toast.success(`${username} foi para: Favoritos`);
    } catch (error) {
      setUser(previousUser);
      toast.error('Erro ao favoritar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {(!includedInDislike && !includedInLike) &&
        <div className='buttons'>
          <button
            type='button'
            onClick={handleDislike}
            disabled={pending}
            aria-label={`Marcar ${username} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={handleLike}
            disabled={pending}
            aria-label={`Favoritar ${username}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </div>
      }

      {includedInDislike &&
        <div className='buttons single'>
          <button type='button' onClick={handleUndoDislike} disabled={pending}>
            <MdSyncDisabled className="dislike" aria-hidden="true" />Desmarcar
          </button>
        </div>
      }

      {includedInLike &&
        <div className='buttons single'>
          <button type='button' onClick={handleUndoLike} disabled={pending}>
            <MdStarBorder aria-hidden="true" />Desmarcar
          </button>
        </div>
      }
    </>
  );
}
