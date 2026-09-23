'use client';

import React, { Suspense, useEffect, useState } from 'react'

import api from '../../services/api'
import { useAuth, isLoggedIn } from '../../hooks/auth';
import { Paginate, VideoThumbItem, Container } from '../../components'
import { VideoData } from '../../types'
import { VideoList } from '../video/style'
import { makePlaceholders } from '../../utils'
import { SessionErrorFallback } from './SessionErrorFallback';

interface SubsFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

// Client Component (voltou a ser CSR — reversão consciente de M1/etapa 2 v3): sessão vive num
// cookie httpOnly, então o axios (`services/api.ts`, withCredentials) já manda o cookie sozinho
// em toda request — não precisa ler `cookies()` no servidor pra isso. Ler `cookies()` no Server
// Component pai forçava `/` e `/video` inteiras a renderização dinâmica (mesmo motivo de
// `searchParams` em Trend.tsx), acoplando a listagem pública ao cold start do Render. Só monta
// dentro da aba "Inscrições" (Tabs.Content sem forceMount desmonta a aba inativa) — então só
// busca quando a sessão já hidratou E a aba é aberta, nunca antes.
export default function Subs() {
  const { user, isHydrated } = useAuth();
  const loggedIn = isHydrated && isLoggedIn(user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [docs, setDocs] = useState<VideoData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    async function loadDocs() {
      try {
        setLoading(true);
        setError(false);
        setDocs(makePlaceholders<VideoData>(itemsPerPage || 30));

        const { data } = await api.get<SubsFeed>('/feed/subscriptions', { params: { page } });

        if (cancelled) return;

        setDocs(data.docs);
        setTotal(data.total);
        setItemsPerPage(data.itemsPerPage);
      } catch {
        if (cancelled) return;

        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDocs();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loggedIn]);

  if (error) {
    return <SessionErrorFallback message="Não foi possível carregar suas inscrições agora." />;
  }

  return (
    <Container loading={false} unstylized className='container-full-width'>
      <VideoList className="subs list-flex-column">
        {docs.map((item, index) => (
          <VideoThumbItem key={item._id || index} video={item} placeholder={loading} />
        ))}
      </VideoList>
      {/* Suspense obrigatório — ver comentário equivalente em Trend.tsx. Na prática esta seção
         nunca chega a ser prerenderizada estaticamente (só monta com sessão já hidratada, que
         nunca acontece durante o build), mas mantido por defesa caso essa condição mude. */}
      {!loading &&
        <Suspense fallback={null}>
          <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={setPage} />
        </Suspense>
      }
    </Container>
  )
}
