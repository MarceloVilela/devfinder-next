'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/auth';
import LoginContainer from '../login/style';

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
      signOut();
      return;
    }

    if (isHydrated && user && Object.keys(user).includes('_id')) {
      router.push('/');
    }
  }, [user, router, isHydrated, searchParams, signOut])

  useEffect(() => {
    if (message) {
      toast.error(message.content);
    }
  }, [message])

  return (
    <LoginContainer>
      <form>
        <h1 className="logo">{process.env.NEXT_PUBLIC_TITLE}</h1>

        <Link href='/'><span className="login-visitor">Acessar como visitante</span></Link>

        <a href={process.env.NEXT_PUBLIC_API_URL + '/auth/github'} className="login-social-github">Acessar com Github</a>
      </form>
    </LoginContainer>
  )
}
