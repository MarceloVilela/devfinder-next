import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaHome } from 'react-icons/fa';

import { fetchJSON } from '../../../lib/fetchJSON';
import { Container } from '../../../components';
import { UserData } from '../../../hooks/auth';

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
      <article className="flex flex-col w-[270px] items-center mx-auto">
        <Image
          className="border-0 rounded-full w-[270px] mb-6"
          src={user.avatar}
          alt={user.user}
          width={270}
          height={270}
        />

        <p className="self-start text-left text-foreground-stronger text-[2rem]">{user.name}</p>
        <p className="self-start text-left text-foreground">{user.user}</p>
        <p className="self-start text-left text-foreground-strong my-6">{user.bio}</p>

        <p className="self-start text-left text-foreground"></p>

        <div className="flex flex-col justify-between">
          <a
            href={`https://github.com/${user.user}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="h-[50px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05)] border-0 rounded-[4px] bg-primary-stronger cursor-pointer text-white flex items-center justify-center w-[270px] mb-6">
              <span className="flex-1 text-left ml-6 uppercase font-bold">Acessar</span>
              <FaGithub className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>

          <a
            href={'/user'}
            rel="noopener noreferrer"
          >
            <button className="h-[50px] shadow-[0_2px_2px_0_rgba(0,0,0,0.05)] border-0 rounded-[4px] bg-primary-stronger cursor-pointer text-white flex items-center justify-center w-[270px] mb-6">
              <span className="flex-1 text-left ml-6 uppercase font-bold">Listar outros</span>
              <FaHome className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>
        </div>
      </article>
    </Container>
  );
}
