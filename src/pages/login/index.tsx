import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { LoginContainer } from './style'

interface LoginProps {
  history: {
    push(route: string): void;
  }
}

const Login: React.FC<LoginProps> = ({ history }) => {
  const router = useRouter();
  const { user, socialAuthCallback, signOut, message } = useAuth();

  const loadProfile = useCallback(async function (token: string) {
    try {
      api.defaults.headers.authorization = `Bearer ${token}`;
      const config = {
        headers: { authorization: `Bearer ${token}` }
      };

      const { data: user } = await api.get('/me', config);

      socialAuthCallback({ token, user });
    } catch (error) {
      toast.error(`Erro ao listar perfil - ${error.message}`);
    }
  }, [socialAuthCallback]);

  useEffect(() => {
    signOut();
  }, [signOut])

  useEffect(() => {
    const { token } = router.query;

    console.log('token', token);
    if (typeof token === 'string') {
      loadProfile(token);
    }
  }, [router, loadProfile])

  useEffect(() => {
    const { logout } = router.query;

    console.log('logout', logout);
    if (logout) {
      return;
    }

    console.log('user', user);
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
      <form>
        <h1 className="logo">{process.env.REACT_APP_TITLE}</h1>

        <Link href='/'><a className="login-visitor">Acessar como visitante</a></Link>

        <a href={process.env.NEXT_PUBLIC_API_URL + '/auth/github'} className="login-social-github">Acessar com Github</a>
      </form>
    </LoginContainer>
  )
}

export default Login;