'use client';

import React, { Suspense, useState } from 'react'
import { toast } from 'react-toastify'

import { ListingFeed, UserData } from '../../types'
import { Container, UserItem, UserItemSkeleton, Paginate } from '../../components'
import { makePlaceholders, getErrorMessage } from '../../utils'
import api from '../../services/api'
import UserLikeButtons from './UserLikeButtons'

export interface UserAllProps {
  docsStatic: UserData[];
  totalStatic: number;
  itemsPerPageStatic: number;
}

// Client Component — ver comentário equivalente em Trend.tsx (mesma reversão: `page.tsx` busca
// só a página 1, estática/ISR; página 2+ é fetch client-side aqui).
function UserAll({ docsStatic, totalStatic, itemsPerPageStatic }: UserAllProps) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState(docsStatic);
  const [total, setTotal] = useState(totalStatic);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageStatic);

  const handlePaginate = async (goTo: number) => {
    if (goTo === page) return;

    if (goTo === 1) {
      setPage(1);
      setDocs(docsStatic);
      setTotal(totalStatic);
      setItemsPerPage(itemsPerPageStatic);
      return;
    }

    const snapshot = { page, docs, total, itemsPerPage };

    setPage(goTo);
    setLoading(true);
    setDocs(makePlaceholders<UserData>(itemsPerPage || 30));

    try {
      const { data } = await api.get<ListingFeed<UserData>>('/devs', { params: { page: goTo } });
      setDocs(data.docs);
      setTotal(data.total);
      setItemsPerPage(data.itemsPerPage);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Página não encontrada.'));
      setPage(snapshot.page);
      setDocs(snapshot.docs);
      setTotal(snapshot.total);
      setItemsPerPage(snapshot.itemsPerPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container unstylized className="container-full-width">
      <ul className="users list-flex-row list-none">
        {docs.map((user, index) => (
          loading
            ? <UserItemSkeleton key={index} />
            : (
              <UserItem key={user._id || index} user={user}>
                <UserLikeButtons userId={user._id} username={user.user} />
              </UserItem>
            )
        ))}
      </ul>
      {/* Suspense obrigatório — ver comentário equivalente em Trend.tsx. */}
      <Suspense fallback={null}>
        <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={handlePaginate} />
      </Suspense>
    </Container>
  )
}

export default UserAll;
