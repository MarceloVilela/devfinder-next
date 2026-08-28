'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { Paginate, VideoThumbItem } from '../../components';
import { VideoData } from '../../types';
import { VideoList } from '../video/style';

interface ChannelVideoFeedProps {
  channelName: string;
  initialDocs: VideoData[];
  initialTotal: number;
  initialItemsPerPage: number;
}

export default function ChannelVideoFeed({ channelName, initialDocs, initialTotal, initialItemsPerPage }: ChannelVideoFeedProps) {
  const [docs, setDocs] = useState<VideoData[]>(initialDocs)
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      try {
        if (page !== 1) {
          setLoading(true)
          setDocs(Array.from(Array(30)).map(item => ({} as VideoData)))
        } else {
          return;
        }

        const { data } = await api.get('/feed/channel', { params: { channel_name: channelName, page } })

        setDocs(data.docs)
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch (error) {
        toast.error('Erro ao listar vídeos do canal')
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [channelName, page])

  return (
    <>
      <VideoList className="subs list-flex-column">
        {docs?.map((item, key) => (
          <VideoThumbItem key={key} video={item} placeholder={loading} />
        ))}
      </VideoList>
      {!loading &&
        <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={setPage} />
      }
    </>
  );
}
