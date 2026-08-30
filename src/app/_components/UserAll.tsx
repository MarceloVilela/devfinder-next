import React from 'react'

import { UserData } from '../../hooks/auth'
import { Container, UserItem, Paginate } from '../../components'
import UsersList from '../user/style'
import UserLikeButtons from './UserLikeButtons'

export interface UserAllProps {
  docsStatic: UserData[];
  totalStatic: number;
  itemsPerPageStatic: number;
  page: number;
}

function UserAll({ docsStatic, totalStatic, itemsPerPageStatic, page }: UserAllProps) {
  return (
    <Container loading={false} unstylized className="container-full-width">

      <UsersList className="users list-flex-row">
        {docsStatic.map((user) => (
          <UserItem key={user._id} user={user} placeholder={false}>
            <UserLikeButtons username={user.user} />
          </UserItem>
        ))}
      </UsersList>
      <Paginate page={page} totalItems={totalStatic} itemsPerPage={itemsPerPageStatic} />
    </Container>
  )
}

export default UserAll;
