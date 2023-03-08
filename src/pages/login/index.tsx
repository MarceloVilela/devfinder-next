import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import LoginContainer from './style'

const Login: React.FC = () => {
  const router = useRouter();
  const { user, socialAuthCallback, signOut, message } = useAuth();

  const loadProfile = useCallback(async function (token: string) {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const config = {
        // headers: { authorization: `Bearer ${token}` }
      };

      const { data: user } = await api.get('/me', config);

      socialAuthCallback({ token, user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Erro ao listar perfil - ${error.message}`);
      }
    }
  }, [socialAuthCallback]);

  useEffect(() => {
    signOut();
  }, [signOut])

  useEffect(() => {
    const { token } = router.query;

    if (typeof token === 'string') {
      loadProfile(token);
    }
  }, [router, loadProfile])

  useEffect(() => {
    const { logout } = router.query;

    if (logout) {
      return;
    }

    if (user && Object.keys(user).includes('_id')) {
      router.push('/');
    }
  }, [user, router])

  useEffect(() => {
    if (message) {
      toast.error(message.content);
    }
  }, [message])

  return (
    <LoginContainer>
      <Head><title>Login | {process.env.NEXT_PUBLIC_TITLE}</title></Head>
      <form>
        <h1 className="logo">{process.env.NEXT_PUBLIC_TITLE}</h1>

        <Link href='/'><a className="login-visitor">Acessar como visitante</a></Link>

        <a href={process.env.NEXT_PUBLIC_API_URL + '/auth/github'} className="login-social-github">Acessar com Github</a>
      </form>
    </LoginContainer>
  )
}

export default Login;