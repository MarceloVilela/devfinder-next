import React from 'react';

import Container from '../Container';
import { classNames } from '../../lib/classNames';
import { SKELETON_BAR_CLASSNAME, SKELETON_COLOR_CLASSNAME } from '../../lib/skeletonClassName';

interface DetailSkeletonProps {
  shape: 'circle' | 'rect' | 'card';
}

// Esqueleto das 3 páginas de detalhe (`loading.tsx` de video/user/channel [slug]): essas rotas
// são renderizadas por request (`cache: 'no-store'`), então com o backend dormindo (cold start do
// Render, ~30-60s) o visitante ficaria olhando a tela anterior sem nenhum sinal de progresso.
// `circle` = avatar grande (user), `rect` = thumbnail (video), `card` = cartão largo com avatar
// pequeno (canal — mesmo formato do `.channel-about` da página, pra reduzir o salto de layout).
// `role="status"` fica num `div` neutro (não no `<article>`) pra não sobrescrever a semântica.
const DetailSkeleton: React.FC<DetailSkeletonProps> = ({ shape }) => {
  const content =
    shape === 'card' ? (
      <div className="w-full flex flex-col p-4 bg-background-weakerer border border-background-weakerer rounded-[15px] mb-12">
        <div className={classNames('w-[100px] h-[100px] rounded-full self-center mb-4', SKELETON_COLOR_CLASSNAME)} />
        <p className={classNames('w-1/3', SKELETON_BAR_CLASSNAME)} />
        <p className={classNames('w-full mt-4', SKELETON_BAR_CLASSNAME)} />
        <p className={classNames('w-2/3', SKELETON_BAR_CLASSNAME)} />
      </div>
    ) : (
      <article className="flex flex-col w-[270px] items-center mx-auto">
        <div
          className={classNames(
            'w-[270px] mb-6',
            shape === 'circle' ? 'h-[270px] rounded-full' : 'h-[203px] rounded-2xl',
            SKELETON_COLOR_CLASSNAME,
          )}
        />
        <p className={classNames('w-full', SKELETON_BAR_CLASSNAME)} />
        <p className={classNames('w-2/3 self-start', SKELETON_BAR_CLASSNAME)} />
      </article>
    );

  return (
    <Container loading={false} className="containerVerticalCenter">
      <div role="status" aria-busy="true" className="w-full">
        <span className="sr-only">Carregando…</span>
        {content}
      </div>
    </Container>
  );
};

export default DetailSkeleton;
