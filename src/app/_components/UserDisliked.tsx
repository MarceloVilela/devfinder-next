'use client';

import React from 'react'
import { MdSyncDisabled } from 'react-icons/md'

import { useAuth } from '../../hooks/auth'
import { CardSkeleton, Container, UserItem } from '../../components'
import UsersList from '../user/style'
import { useUndoList } from './useUndoList'

function UserDisliked() {
  const { user, isHydrated } = useAuth();

  const { docs, loading, handleUndo } = useUndoList({
    listUrl: '/dislikes/devs',
    buildUndoUrl: (username) => `/dislikes/devs/${username}`,
    isLoggedIn: isHydrated && !!(user && user._id),
    guestMessage: 'Acessando como visitante, não é possível desabilitar.',
    buildSuccessMessage: (username) => `${username} saiu de: Não seguidos`,
    errorFallback: 'Erro ao desfazer.',
  })

  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading={loading} loadingLabel="Carregando não seguidos...">
        <UsersList className="users list-flex-row">
          {docs.map((user, key) => (
            <UserItem key={key} user={user} placeholder={loading}>
              <div className='buttons single'>
                <button type='button' onClick={() => handleUndo(user.user)}>
                  <MdSyncDisabled aria-hidden="true" />Desmarcar
                </button>
              </div>
            </UserItem>
          ))}
        </UsersList>
      </CardSkeleton>
    </Container>
  )
}

export default UserDisliked;
