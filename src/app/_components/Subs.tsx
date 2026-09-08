import { CardSkeleton, Container, Paginate, VideoThumbItem } from '../../components';
import { VideoData } from '../../types';
import { VideoList } from '../video/style';
import { fetchSessionJSON } from '../../lib/fetchSessionJSON';
import { resolveSessionSection } from './sessionFetch';
import { makePlaceholders } from '../../utils';

interface SubsFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

interface SubsProps {
  token: string;
  page: number;
}

// Server Component (M1, etapa 2 v3) — mesma razão de UserLiked/UserDisliked. Pagina via
// `?subsPage=N` (não `?page=`, que já é usado por Trend/Explorar na mesma rota `/`; ver
// Paginate `pageParam` e app/page.tsx).
export default async function Subs({ token, page }: SubsProps) {
  return resolveSessionSection(
    () => fetchSessionJSON<SubsFeed>(`/feed/subscriptions?page=${page}`, token),
    'Não foi possível carregar suas inscrições agora.',
    ({ docs, total, itemsPerPage }) => (
      <Container loading={false} unstylized className="container-full-width">
        <VideoList className="subs list-flex-column">
          {docs.map((item) => (
            <VideoThumbItem key={item._id} video={item} />
          ))}
        </VideoList>
        <Paginate page={page} totalItems={total} itemsPerPage={itemsPerPage} pageParam="subsPage" />
      </Container>
    ),
  );
}

export function SubsSkeleton() {
  return (
    <Container loading={false} unstylized className="container-full-width">
      <CardSkeleton loading loadingLabel="Carregando inscrições...">
        <VideoList className="subs list-flex-column">
          {makePlaceholders<VideoData>(30).map((item, key) => (
            <VideoThumbItem key={key} video={item} placeholder />
          ))}
        </VideoList>
      </CardSkeleton>
    </Container>
  );
}
