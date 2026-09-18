'use client';

import { FeedbackMessage } from '../components';

// Mensagem sempre genérica — o Next.js redige `error.message` de erro de Server Component em
// build de produção (troca por mensagem genérica + `digest`, só preservado em `pnpm dev`), então
// não dá pra diferenciar causa aqui de forma confiável. Erro de rede das listagens já não chega
// até aqui — é capturado localmente em cada página (ver A4, `fetchJSON`/`timeoutMs`); este
// boundary só trata erro de render de fato inesperado.
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
