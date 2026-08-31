import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaGithub } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Container } from '../../../components';
import { ChannelData, VideoData } from '../../../types';
import About from './style';
import ChannelLikeButtons from '../../_components/ChannelLikeButtons';
import ChannelVideoFeed from '../../_components/ChannelVideoFeed';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface ChannelFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

// A API devolve 200 + corpo `null` quando o canal não existe (não 404) — fetchJSON já repassa
// esse `null` naturalmente. Sem try/catch aqui: erro de rede real (API fora do ar) sobe pro
// error.tsx em vez de virar "não encontrado" — só ausência de dado vira notFound().
async function getChannel(searchQuery: string): Promise<ChannelData | null> {
  return fetchJSON<ChannelData | null>(`/channels/${searchQuery}`, { cache: 'no-store' });
}

async function getChannelFeed(channelName: string, page: number): Promise<ChannelFeed> {
  return fetchJSON<ChannelFeed>(
    `/feed/channel?channel_name=${encodeURIComponent(channelName)}&page=${page}`,
    { cache: 'no-store' },
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const channel = await getChannel(slug);

  if (!channel) {
    return { title: 'Canal não encontrado' };
  }

  return { title: `Canal ${channel.name}` };
}

export default async function ChannelDetail({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const channel = await getChannel(slug);

  if (!channel) {
    notFound();
  }

  const { docs, total, itemsPerPage } = await getChannelFeed(channel.name, currentPage);

  return (
    <Container loading={false} className="containerVerticalCenter">
      <About>
        <li key={channel._id}>
          <div className="avatar">
            <Image
              src={channel.avatar ? channel.avatar : 'https://yt3.ggpht.com/a/AATXAJzF6fuUyEFRBtZSpScb9M-Dq4QI6pyv0ic3pw=s100-c-k-c0xffffffff-no-rj-mo'}
              alt={channel.name}
              width={100}
              height={100}
            />
          </div>

          <aside>
            <h3>{channel.name}</h3>

            <div>
              <strong>Tags</strong>
              <p>{channel.tags.join(", ")}</p>
            </div>

            <div>
              <strong>Sobre</strong>
              <p>{channel.description}</p>
              <p></p>

              <ChannelLikeButtons channelId={channel._id} channelName={channel.name} />
            </div>

            <div>
              <strong>Acessar</strong>
              <a
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube color="#ff0000" />
              </a>
              {channel.userGithub &&
                <a
                  href={`https://github.com/${channel.userGithub}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub color="#fff" />
                </a>
              }
            </div>
          </aside>
        </li>
      </About>

      <ChannelVideoFeed
        docsStatic={docs}
        totalStatic={total}
        itemsPerPageStatic={itemsPerPage}
        page={currentPage}
      />
    </Container>
  );
}
