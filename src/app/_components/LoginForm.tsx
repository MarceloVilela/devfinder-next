'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAuth, isLoggedIn } from '../../hooks/auth';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut, message, isHydrated } = useAuth();

  // O redirect de callback do GitHub já volta pra /login sem query string — o backend seta o
  // cookie httpOnly de sessão direto na resposta do OAuth. A hidratação global (Providers/
  // Hydrator, chamada em todo carregamento) já refaz GET /me e popula o user a partir do
  // cookie; não há mais token pra ler da URL aqui.

  useEffect(() => {
    const logout = searchParams?.get('logout');

    if (logout) {
      // Mesma checagem de Header.tsx (achado #2, code-review Etapa 2): `signOut()` sempre limpa
      // o estado local mesmo em falha, só retorna `true` se o backend confirmou. `/login` não
      // renderiza Server Component dependente de sessão, então não há `router.refresh()` aqui —
      // só o aviso, pra não silenciar uma falha real de logout.
      signOut().then((confirmedByBackend) => {
        if (!confirmedByBackend) {
          toast.error('Não foi possível confirmar o encerramento da sessão com o servidor. Tente novamente.');
        }
      });
      return;
    }

    if (isHydrated && isLoggedIn(user)) {
      router.push('/');
    }
  }, [user, router, isHydrated, searchParams, signOut])

  useEffect(() => {
    if (message) {
      toast.error(message.content);
    }
  }, [message])

  return (
    <div className="h-full flex justify-center items-center">
      <form className="w-full max-w-[300px] flex flex-col h-[33vh] justify-evenly">
        <h1 className="logo font-['Grenze_Gotisch',cursive] text-center text-primary">{process.env.NEXT_PUBLIC_TITLE}</h1>

        <Link
          href='/'
          className="mt-[10px] border-0 rounded-[4px] h-12 text-base bg-[#9373d8] font-bold text-white cursor-pointer flex justify-center items-center"
        >
          <span className="login-visitor bg-inherit">Acessar como visitante</span>
        </Link>

        <a
          href={process.env.NEXT_PUBLIC_API_URL + '/auth/github'}
          className="login-social-github mt-[10px] border-0 rounded-[4px] h-12 text-base bg-[#28a745] font-bold text-white cursor-pointer flex justify-center items-center"
        >
          Acessar com Github
        </a>
      </form>
    </div>
  )
}
