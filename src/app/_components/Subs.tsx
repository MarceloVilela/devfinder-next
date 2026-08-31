'use client';

import React, { useEffect, useState } from 'react'

import api from '../../services/api'
import { useAuth } from '../../hooks/auth';
import { CardSkeleton, Paginate, VideoThumbItem, Container } from '../../components'
import { VideoData } from '../../types'
import { VideoList } from '../video/style'
import { makePlaceholders } from '../../utils'

const Subs = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState<VideoData[]>([] as VideoData[])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadDocs() {
      try {
        setLoading(true)
        setDocs(makePlaceholders<VideoData>(30))

        const { data } = await api.get('/feed/subscriptions', { params: { page } })
        setDocs(data.docs)
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch (error) {
        // silencioso, mesmo comportamento do Pages Router
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [page, user])

  return (
    <Container loading={false} unstylized className='container-full-width'>
      <CardSkeleton loading={loading} loadingLabel="Carregando inscrições...">
        <VideoList className="subs list-flex-column">
          {docs.map((item, key) => (
            <VideoThumbItem key={key} video={item} placeholder={loading} />
          ))}
        </VideoList>
      </CardSkeleton>
      {!loading &&
        <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={setPage} />
      }
    </Container>
  )
}

export default Subs;
