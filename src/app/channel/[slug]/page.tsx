import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaYoutube, FaGithub } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Header, Container, Footer } from '../../../components';
import { ChannelData, VideoData } from '../../../types';
import About from './style';
import ChannelLikeButtons from '../../_components/ChannelLikeButtons';
import ChannelVideoFeed from '../../_components/ChannelVideoFeed';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ChannelFeed {
  docs: VideoData[];
  total: number;
  itemsPerPage: number;
}

async function getChannel(searchQuery: string): Promise<ChannelData | null> {
  try {
    return await fetchJSON<ChannelData>(`/channels/${searchQuery}`, { cache: 'no-store' });
  } catch {
    return null;
  }
}

async function getChannelFeed(channelName: string): Promise<ChannelFeed> {
  return fetchJSON<ChannelFeed>(`/feed/channel?channel_name=${encodeURIComponent(channelName)}`, {
    cache: 'no-store',
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const channel = await getChannel(slug);

  if (!channel) {
    return { title: 'Canal não encontrado' };
  }

  return { title: `Canal ${channel.name}` };
}

export default async function ChannelDetail({ params }: PageProps) {
  const { slug } = await params;
  const channel = await getChannel(slug);

  if (!channel) {
    notFound();
  }

  const { docs, total, itemsPerPage } = await getChannelFeed(channel.name);

  return (
    <>
      <Header />

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
          channelName={channel.name}
          initialDocs={docs}
          initialTotal={total}
          initialItemsPerPage={itemsPerPage}
        />
      </Container>

      <Footer />
    </>
  );
}
