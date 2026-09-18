import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaGithub } from 'react-icons/fa';

import { fetchDetail } from '../../../lib/fetchDetail';
import { fetchListing, ListingFeed, LISTING_UNAVAILABLE_MESSAGE } from '../../../lib/fetchListing';
import { Container, FeedbackMessage } from '../../../components';
import { ChannelData, VideoData } from '../../../types';
import './style.css';
import ChannelLikeButtons from '../../_components/ChannelLikeButtons';
import ChannelVideoFeed from '../../_components/ChannelVideoFeed';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Ausência de canal (não 404 real, 200 + `null`) vs. erro de rede: ver `lib/fetchDetail.ts`.
async function getChannel(searchQuery: string): Promise<ChannelData | null> {
  return fetchDetail<ChannelData>(`/channels/${searchQuery}`);
}

// Ao contrário de getChannel, o feed do canal não tem semântica de "não encontrado" — mesmo
// canal com feed vazio ainda é uma resposta válida. Usa `fetchListing` (mesmo padrão das 4
// listagens públicas: catch + null + log) em vez de deixar timeout virar error.tsx cru (achado
// do fechamento v4 — a versão anterior deste código tinha `timeoutMs` sem nenhum catch).
async function getChannelFeed(channelName: string, page: number): Promise<ListingFeed<VideoData> | null> {
  return fetchListing<ListingFeed<VideoData>>(
    `/feed/channel?channel_name=${encodeURIComponent(channelName)}&page=${page}`,
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

  const feed = await getChannelFeed(channel.name, currentPage);

  if (!feed) {
    return <FeedbackMessage message={LISTING_UNAVAILABLE_MESSAGE} />;
  }

  const { docs, total, itemsPerPage } = feed;

  return (
    <Container loading={false} className="containerVerticalCenter">
      <ul className="channel-about bg-background-weakerer border border-background-weakerer rounded-[15px] mb-12">
        <li key={channel._id} className="flex flex-col p-4">
          <div className="avatar flex justify-center items-center">
            <Image
              className="w-[100px] rounded-full"
              src={channel.avatar ? channel.avatar : 'https://yt3.ggpht.com/a/AATXAJzF6fuUyEFRBtZSpScb9M-Dq4QI6pyv0ic3pw=s100-c-k-c0xffffffff-no-rj-mo'}
              alt={channel.name}
              width={100}
              height={100}
            />
          </div>

          <aside className="flex flex-col justify-center flex-1 pl-4 text-left rounded-b-[5px]">
            <h3 className="text-2xl font-normal text-foreground-stronger">{channel.name}</h3>

            <div className="flex flex-wrap items-center mt-4">
              <strong className="text-base text-foreground-stronger">Tags</strong>
              <p className="text-sm leading-5 text-foreground-strong w-full">{channel.tags.join(", ")}</p>
            </div>

            <div className="flex flex-wrap items-center mt-4">
              <strong className="text-base text-foreground-stronger">Sobre</strong>
              <p className="text-sm leading-5 text-foreground-strong w-full">{channel.description}</p>
              <p className="text-sm leading-5 text-foreground-strong w-full"></p>

              <ChannelLikeButtons channelId={channel._id} channelName={channel.name} />
            </div>

            <div className="flex flex-wrap items-center mt-4">
              <strong className="text-base text-foreground-stronger">Acessar</strong>
              <a
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube color="#ff0000" className="text-[32px] ml-8" />
              </a>
              {channel.userGithub &&
                <a
                  href={`https://github.com/${channel.userGithub}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub color="#fff" className="text-[32px] ml-8" />
                </a>
              }
            </div>
          </aside>
        </li>
      </ul>

      <ChannelVideoFeed
        docsStatic={docs}
        totalStatic={total}
        itemsPerPageStatic={itemsPerPage}
        page={currentPage}
      />
    </Container>
  );
}
