import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaHome } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Container } from '../../../components';
import { UserData } from '../../../hooks/auth';
import About from './style';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// A API devolve 200 + corpo `null` quando o dev não existe (não 404) — fetchJSON já repassa
// esse `null` naturalmente. Sem try/catch aqui: erro de rede real (API fora do ar) sobe pro
// error.tsx em vez de virar "não encontrado" — só ausência de dado vira notFound().
async function getUser(username: string): Promise<UserData | null> {
  return fetchJSON<UserData | null>(`/devs/${username}`, { cache: 'no-store' });
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
  );
}
