import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FaGithub, FaHome } from 'react-icons/fa';

import { fetchDetail } from '../../../lib/fetchDetail';
import { classNames } from '../../../lib/classNames';
import { DETAIL_ACTION_BUTTON_CLASSNAME } from '../../../lib/detailActionButtonClassName';
import { Container } from '../../../components';
import { UserData } from '../../../hooks/auth';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Ausência de dev (não 404 real, 200 + `null`) vs. erro de rede: ver `lib/fetchDetail.ts`.
async function getUser(username: string): Promise<UserData | null> {
  return fetchDetail<UserData>(`/devs/${username}`);
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
            <button className={classNames(DETAIL_ACTION_BUTTON_CLASSNAME, 'bg-primary-stronger')}>
              <span className="flex-1 text-left ml-6 uppercase font-bold">Acessar</span>
              <FaGithub className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>

          <a
            href={'/user'}
            rel="noopener noreferrer"
          >
            <button className={classNames(DETAIL_ACTION_BUTTON_CLASSNAME, 'bg-primary-stronger')}>
              <span className="flex-1 text-left ml-6 uppercase font-bold">Listar outros</span>
              <FaHome className="text-2xl text-white mx-4 w-8" />
            </button>
          </a>
        </div>
      </article>
    </Container>
  );
}
