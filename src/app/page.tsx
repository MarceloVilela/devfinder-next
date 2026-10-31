import type { Metadata } from 'next';

import { fetchListing, ListingFeed, LISTING_UNAVAILABLE_MESSAGE } from '../lib/fetchListing';
import { COLD_START_TIMEOUT_MS } from '../lib/fetchJSON';
import { VideoData } from '../types';
import { FeedbackMessage } from '../components';
import HomeFeed from './_components/HomeFeed';
import Trend from './_components/Trend';

// A "/" coincide com o segmento do root layout — o `template` de título definido lá
// não se aplica ao próprio segmento que o declara (comportamento documentado do Next.js),
// por isso o título completo é montado aqui explicitamente.
export const metadata: Metadata = {
  title: `Home | ${process.env.NEXT_PUBLIC_TITLE ?? 'DevFinder'}`,
};

// Acompanha COLD_START_TIMEOUT_MS (lib/fetchJSON.ts) — sem isso a própria Vercel mata
// a função bem antes dos 55s do nosso timeout (10s default no Hobby sem Fluid Compute); 60s é o
// teto do Hobby legado, por isso o nosso timeout interno fica um pouco abaixo pra sempre ganhar
// a corrida e devolver o fallback amigável em vez de um 504 cru da plataforma.
export const maxDuration = 60;

// Sem `searchParams` nem `cookies()` de propósito (reversão consciente de M1, etapa 2 v3): ler
// qualquer um dos dois no Server Component força a rota inteira a renderização dinâmica — sem
// isso, "/" volta a ser ○ Static/ISR (como `/channel`), imune a uma visita comum depender do
// Render estar acordado. Busca só a página 1; página 2+ (Trend.tsx) e a aba "Inscrições"
// (HomeFeed.tsx -> Subs.tsx) viraram fetch client-side, que já manda o cookie de sessão sozinho
// (axios `withCredentials`) sem precisar de `cookies()` aqui.
export default async function HomePage() {
  // .catch() local (não em fetchListing) pra proteger só a 1ª geração da rota (ex. cold start do
  // Render logo após um deploy) sem reverter o throw default de fetchListing — ver comentário em
  // lib/fetchListing.ts.
  const trend = await fetchListing<ListingFeed<VideoData>>('/feed/trending?page=1', {
    next: { revalidate: 60 * 60 * 8 },
    timeoutMs: COLD_START_TIMEOUT_MS,
  }).catch(() => null);

  if (!trend) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  const { docs, total, itemsPerPage } = trend;

  return (
    <HomeFeed>
      <Trend docsStatic={docs} totalStatic={total} itemsPerPageStatic={itemsPerPage} />
    </HomeFeed>
  );
}
