import { useCallback } from 'react';

import api from '../services/api';
import { isServer } from '../utils';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions, UserData } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';

export type { UserData };

// Sessão vive só no cookie httpOnly do backend — nunca em localStorage/JS. Hidratar a sessão
// é perguntar ao backend "quem sou eu" (o cookie vai junto sozinho); um 401 aqui só significa
// visitante anônimo, não erro (ver isSessionCheck em services/api.ts).
export const hydrateAuth = () => async (dispatch: AppDispatch) => {
  if (isServer()) return;

  // Limpeza de migração: navegadores que logaram antes desta correção ainda têm o token da
  // sessão antiga salvo aqui (o fluxo por ?token=/localStorage foi descontinuado, mas nada
  // limpava o que já existia) — sem isso, o token velho continua exposto a XSS indefinidamente.
  localStorage.removeItem('@DevFinder:token');
  localStorage.removeItem('@DevFinder:user');

  try {
    const { data: user } = await api.get<UserData>('/me');
    dispatch(authActions.setUser(user));
  } catch {
    // visitante sem sessão — segue anônimo
  }

  dispatch(authActions.setHydrated(true));
};

function useAuth() {
  const dispatch = useAppDispatch();
  const { user, message, isHydrated } = useAppSelector((state) => state.auth);

  const signOut = useCallback(async () => {
    if (isServer()) return;

    // cookie é httpOnly, só o backend consegue limpar
    await api.post('/auth/logout').catch(() => {});

    dispatch(authActions.signOut());
  }, [dispatch]);

  const socialAuthCallback = useCallback(({ user }: { user: UserData }) => {
    if (isServer()) return;

    dispatch(authActions.setUser(user));
  }, [dispatch]);

  const setUser = useCallback((user: UserData) => {
    if (isServer()) return;

    dispatch(authActions.setUser(user));
  }, [dispatch]);

  return { user, setUser, signOut, socialAuthCallback, message, isHydrated };
}

export { useAuth };
