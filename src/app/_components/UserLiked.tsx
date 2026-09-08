'use client';

import React from 'react'
import { MdStarBorder } from 'react-icons/md'

import { useAuth } from '../../hooks/auth'
import { CardSkeleton, Container, UserItem } from '../../components'
import UsersList from '../user/style'
import { useUndoList } from './useUndoList'

function UserLiked() {
  const { user, isHydrated } = useAuth();

  const { docs, loading, handleUndo } = useUndoList({
    listUrl: '/likes/devs',
    buildUndoUrl: (username) => `/likes/devs/${username}`,
    isLoggedIn: isHydrated && !!(user && user._id),
    guestMessage: 'Acessando como visitante, não é possível favoritar.',
    buildSuccessMessage: (username) => `${username} saiu de: Favoritos`,
    errorFallback: 'Erro ao desfazer favorito.',
  })

  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading={loading} loadingLabel="Carregando favoritos...">
        <UsersList className="users list-flex-row">
          {docs.map((user, key) => (
            <UserItem key={key} user={user} placeholder={loading}>
              <div className='buttons single'>
                <button type='button' onClick={() => handleUndo(user.user)}>
                  <MdStarBorder className="dislike" aria-hidden="true" />Desmarcar
                </button>
              </div>
            </UserItem>
          ))}
        </UsersList>
      </CardSkeleton>
    </Container>
  )
}

export default UserLiked;
