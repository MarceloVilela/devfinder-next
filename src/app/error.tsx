'use client';

import { FeedbackMessage } from '../components';

// Mensagem sempre genérica — o Next.js redige `error.message` de erro de Server Component em
// build de produção (troca por mensagem genérica + `digest`, só preservado em `pnpm dev`), então
// não dá pra diferenciar causa aqui de forma confiável. Erro de rede das 3 páginas de detalhe e,
// desde review-human.md #1, também das 4 listagens públicas chega até aqui de propósito — é
// assim que o ISR das listagens preserva a última versão boa em cache em vez de substituí-la por
// uma mensagem de erro (ver `fetchListing.ts`); as 3 seções de sessão (`Subs`/`UserLiked`/
// `UserDisliked`, sem cache de ISR pra proteger) continuam com fallback local próprio.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <FeedbackMessage
      message="Algo deu errado. Tente novamente em instantes."
      action={
        <button type="button" onClick={reset} className="mt-4 underline cursor-pointer">
          Tentar novamente
        </button>
      }
    />
  );
}
