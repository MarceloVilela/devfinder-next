import { useCallback } from 'react';

import api from '../services/api';
import { isServer } from '../utils';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions, UserData } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';

export type { UserData };

// Fonte única pra "usuário tem sessão" — `user` nunca é null/undefined (default `{}` no slice),
// então checar presença de `_id` é o jeito correto de diferenciar visitante de logado.
// Compartilhado entre Header e LoginForm (antes cada um checava de um jeito diferente — achado
// #9, code-review Etapa 2).
export const isLoggedIn = (user: UserData): boolean => Boolean(user?._id);

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
    if (isServer()) return false;

    // cookie é httpOnly, só o backend consegue limpar; o estado client-side é limpo de
    // qualquer forma (permite ao usuário "esquecer" a sessão local mesmo com o backend fora do
    // ar) — o retorno diz pro chamador se o backend confirmou, pra decidir se é seguro
    // reexecutar Server Components que dependem do cookie (ver Header, A2/code-review Etapa 2).
    const confirmedByBackend = await api.post('/auth/logout').then(() => true).catch(() => false);

    dispatch(authActions.signOut());

    return confirmedByBackend;
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
