import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaHome } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Header, Container, Footer } from '../../../components';
import { UserData } from '../../../hooks/auth';
import About from './style';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getUser(username: string): Promise<UserData | null> {
  try {
    return await fetchJSON<UserData>(`/devs/${username}`, { cache: 'no-store' });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const user = await getUser(slug);

  if (!user) {
    return { title: 'Usuário não encontrado' };
  }

  return { title: `Usuário ${user.name}` };
}

export default async function UserDetail({ params }: PageProps) {
  const { slug } = await params;
  const user = await getUser(slug);

  if (!user) {
    notFound();
  }

  return (
    <>
      <Header />

      <Container loading={false} className="containerVerticalCenter">
        <About>
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
      </Container>

      <Footer />
    </>
  );
}
