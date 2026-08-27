import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { FaGithub, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

import api from '../../services/api'
import { Header, Container, Footer } from '../../components'
import About from './UserDetailStyle'
import { UserData } from '../../hooks/auth'
import { getErrorMessage } from '../../utils'

const UserDetail: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState({} as UserData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadUsers() {
      const { slug: username } = router.query;

      if (!username) {
        return;
      }

      try {
        setLoading(true)

        const { data } = await api.get<UserData>(`/devs/${username}`);

        if (!data) {
          toast.error(`Ops! Usuário ${username} não encontrado.`);
          router.push('/');
        }

        setUser(data);
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          toast.error(getErrorMessage(error, `Usuário ${username} não encontrado.`), {
            autoClose: false,
            closeOnClick: false,
          });
        }
      } finally {
        setLoading(false);
      }

    }
    loadUsers()
  }, [router])

  return (
    <>
      <Header />

      <Container loading={loading} className="containerVerticalCenter">

        {'name' in user && (
          <About>
            <Head><title>Usuário {user.name} | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
            <Image
              className="thumb"
              src={user.avatar}
              alt={user.user}
              width={270}
              height={270}
            />

            <p className="title">{user.name}</p>
            <p>{user.user}</p>
            <p className="bio">{user.bio}</p>

            <p></p>

            <div className="buttons">
              <a
                href={`https://github.com/${user.user}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>
                  <span>Acessar</span>
                  <FaGithub />
                </button>
              </a>

              <a
                href={'/user'}
                rel="noopener noreferrer"
              >
                <button>
                  <span>Listar outros</span>
                  <FaHome />
                </button>
              </a>
            </div>
          </About>
        )}
      </Container>

      <Footer />
    </>
  )
}

export default UserDetail;