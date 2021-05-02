import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import { MdSyncDisabled, MdStarBorder } from 'react-icons/md'
import { toast } from 'react-toastify';

import api from '../../services/api'
import { useAuth } from '../../hooks/auth';
import { Header, Container, Footer } from '../../components'
import About from './ChannelDetailStyle'

export interface ChannelData {
  tags: string[];
  likes: string[];
  deslikes: string[];
  _id: string;
  name: string;
  link: string;
  userGithub: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
}

interface ChannelDetailProps {
  match: {
    params: {
      id: string;
    }
  }
}

const ChannelDetail: React.FC<ChannelDetailProps> = ({ match }) => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [channel, setchannel] = useState<ChannelData>({} as ChannelData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadchannels() {
      const { slug: search_query } = router.query;

      if (!search_query) {
        return;
      }

      try {
        setLoading(true)

        const { data } = await api.get<ChannelData>(`/channels/${search_query}`)

        if (!data) {
          toast.error(`Ops! canal ${search_query} não encontrado.`);
          router.push('/channel');
        }

        setchannel(data)
      } catch (error) {
        toast.error(`Erro ao listar detalhes do canal: ${search_query}`)
      } finally {
        setLoading(false)
      }

    }
    loadchannels()
  }, [router])

  const includedInLike = useMemo(() => {
    if (!user) {
      return false
    }
    return user.follow.includes(channel._id);
  }, [user, channel])

  const includedInDislike = useMemo(() => {
    if (!user) {
      return false
    }
    return user.ignore.includes(channel._id);
  }, [user, channel])

  async function handleUndoDislike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    try {
      const { data } = await api.delete(`/dislikes/channels/${channel.name}`);
      toast.success(`${channel.name} saiu de: Não seguidos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao desabilitar.');
    }
  }

  async function handleUndoLike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    try {
      const { data } = await api.delete(`/likes/channels/${channel.name}`)
      toast.success(`${channel.name} saiu de: Favoritos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  }

  async function handleDislike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível desabilitar.');
      return;
    }

    try {
      const { data } = await api.post(`/dislikes/channels/${channel.name}`)
      toast.success(`${channel.name} foi para: Não seguidos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao desabilitar.');
    }
  }

  async function handleLike() {
    if (!user) {
      toast.error('Acessando como visitante, não é possível favoritar.');
      return;
    }

    try {
      const { data } = await api.post(`/likes/channels/${channel.name}`)
      toast.success(`${channel.name} foi para: Favoritos`);
      setUser(data);
    } catch (error) {
      toast.error('Erro ao favoritar.');
    }
  }

  return (
    <>
      <Header />

      <Container loading={loading} className="containerVerticalCenter">

        {
          '_id' in channel && (
            <>
              <About>
                <Head><title>Canal {channel.name} | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
                <li key={channel._id}>
                  <div className="avatar">
                    <img
                      src={channel.avatar ? channel.avatar : 'https://yt3.ggpht.com/a/AATXAJzF6fuUyEFRBtZSpScb9M-Dq4QI6pyv0ic3pw=s100-c-k-c0xffffffff-no-rj-mo'}
                      alt={channel.name}
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
                      <p>{/*JSON.stringify(theme)*/}</p>

                      <div className='buttons'>
                        {(!includedInDislike && !includedInLike) &&
                          <>
                            <button type='button' onClick={() => handleDislike()}>
                              <MdSyncDisabled className="dislike" />
                            </button>

                            <button type='button' onClick={() => handleLike()}>
                              <MdStarBorder />
                            </button>
                          </>
                        }

                        {includedInDislike &&
                          <button type='button' onClick={() => handleUndoDislike()}>
                            <MdSyncDisabled className="dislike" /><span>Desmarcar</span>
                          </button>
                        }

                        {includedInLike &&
                          <button type='button' onClick={() => handleUndoLike()}>
                            <MdStarBorder /><span>Desmarcar</span>
                          </button>
                        }
                      </div>
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
            </>
          )
        }
      </Container>

      <Footer />
    </>
  )
}

export default ChannelDetail;