'use client';

import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import LoginContainer from '../login/style';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, socialAuthCallback, signOut, message, isHydrated } = useAuth();

  const loadProfile = useCallback(async function (token: string) {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data: user } = await api.get('/me');

      socialAuthCallback({ token, user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Erro ao listar perfil - ${error.message}`);
      }
    }
  }, [socialAuthCallback]);

  useEffect(() => {
    signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const token = searchParams?.get('token');

    if (typeof token === 'string') {
      loadProfile(token);
      router.replace('/login');
    }
  }, [searchParams, router, loadProfile])

  useEffect(() => {
    const logout = searchParams?.get('logout');

    if (logout) {
      return;
    }

    if (isHydrated && user && Object.keys(user).includes('_id')) {
      router.push('/');
    }
  }, [user, router, isHydrated, searchParams])

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
