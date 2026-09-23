'use client';

import React, { Suspense, useState } from 'react';
import { toast } from 'react-toastify';

import { Paginate, VideoThumbItem, Container } from '../../components';
import { VideoData } from '../../types';
import { VideoList } from '../video/style';
import { makePlaceholders, getErrorMessage } from '../../utils';
import api from '../../services/api';

export interface TrendProps {
  docsStatic: VideoData[];
  totalStatic: number;
  itemsPerPageStatic: number;
}

interface TrendingFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

// Client Component (voltou a ser CSR além da página 1): ler `searchParams` no Server Component
// pai forçaria a rota inteira a renderização dinâmica, do mesmo jeito que `cookies()` fazia pra
// Subs/UserLiked/UserDisliked antes desta reversão — ver "Dados externos" no CLAUDE.md. O pai
// (`page.tsx`/`video/page.tsx`) busca só a página 1, estática/ISR e imune ao cold start do
// Render; página 2+ é fetch client-side aqui. Custo aceito: `?page=N` deixa de linkar direto pra
// uma página específica — paginação volta a ser só estado local, como era antes da Etapa 2 v3.
const Trend = ({ docsStatic, totalStatic, itemsPerPageStatic }: TrendProps) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState(docsStatic);
  const [total, setTotal] = useState(totalStatic);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageStatic);

  const handlePaginate = async (goTo: number) => {
    if (goTo === page) return;

    // Página 1 já veio pronta do servidor — evita refetch redundante ao voltar pra ela.
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
    setDocs(makePlaceholders<VideoData>(itemsPerPage || 30));

    try {
      const { data } = await api.get<TrendingFeed>('/feed/trending', { params: { page: goTo } });
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
    <Container loading={false} unstylized className='container-full-width'>
      <>
        <VideoList className="subs list-flex-column">
          {docs.map((item, index) => (
            <VideoThumbItem key={item._id || index} video={item} placeholder={loading} />
          ))}
        </VideoList>
        {/* Suspense obrigatório: Paginate chama useSearchParams() incondicionalmente (mesmo em
           modo controlado, que não navega por URL) — sem isso, o Next recusa prerenderizar esta
           rota como estática (exigência do App Router pra useSearchParams() em página SSG). */}
        <Suspense fallback={null}>
          <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} handlePaginate={handlePaginate} />
        </Suspense>
      </>
    </Container>
  )
}

export default Trend;
