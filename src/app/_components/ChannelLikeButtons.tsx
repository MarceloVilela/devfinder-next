'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface ChannelLikeButtonsProps {
  channelId: string;
  channelName: string;
}

export default function ChannelLikeButtons({ channelId, channelName }: ChannelLikeButtonsProps) {
  const { user, setUser, isHydrated } = useAuth();
  const [pending, setPending] = useState(false);

  const includedInLike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false
    }
    return user.follow.includes(channelId);
  }, [user, channelId, isHydrated])

  const includedInDislike = useMemo(() => {
    if (!isHydrated || !user || !user._id) {
      return false
    }
    return user.ignore.includes(channelId);
  }, [user, channelId, isHydrated])

  async function handleUndoDislike() {
    if (!user || !user._id) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    const previousUser = user;
    setPending(true);
    setUser({ ...user, ignore: user.ignore.filter((id) => id !== channelId) });

    try {
      const { data } = await api.delete(`/dislikes/channels/${channelName}`);
      toast.success(`${channelName} saiu de: Não seguidos`);
      setUser(data);
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
    setUser({ ...user, follow: user.follow.filter((id) => id !== channelId) });

    try {
      const { data } = await api.delete(`/likes/channels/${channelName}`)
      toast.success(`${channelName} saiu de: Favoritos`);
      setUser(data);
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
    setUser({ ...user, ignore: [...user.ignore, channelId] });

    try {
      const { data } = await api.post(`/dislikes/channels/${channelName}`)
      toast.success(`${channelName} foi para: Não seguidos`);
      setUser(data);
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
    setUser({ ...user, follow: [...user.follow, channelId] });

    try {
      const { data } = await api.post(`/likes/channels/${channelName}`)
      toast.success(`${channelName} foi para: Favoritos`);
      setUser(data);
    } catch (error) {
      setUser(previousUser);
      toast.error('Erro ao favoritar.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className='buttons'>
      {(!includedInDislike && !includedInLike) &&
        <>
          <button
            type='button'
            onClick={() => handleDislike()}
            disabled={pending}
            aria-label={`Marcar ${channelName} como não seguido`}
          >
            <MdSyncDisabled className="dislike" aria-hidden="true" />
          </button>

          <button
            type='button'
            onClick={() => handleLike()}
            disabled={pending}
            aria-label={`Favoritar ${channelName}`}
          >
            <MdStarBorder aria-hidden="true" />
          </button>
        </>
      }

      {includedInDislike &&
        <button type='button' onClick={() => handleUndoDislike()} disabled={pending}>
          <MdSyncDisabled className="dislike" aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }

      {includedInLike &&
        <button type='button' onClick={() => handleUndoLike()} disabled={pending}>
          <MdStarBorder aria-hidden="true" /><span>Desmarcar</span>
        </button>
      }
    </div>
  );
}
