import { useCallback } from 'react';

import api from '../services/api';
import { isServer } from '../utils';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions, UserData } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';

export type { UserData };

export const hydrateAuth = () => (dispatch: AppDispatch) => {
  if (isServer()) return;

  const token = localStorage.getItem('@DevFinder:token');
  const user = localStorage.getItem('@DevFinder:user');

  if (token && user) {
    const userParsed = JSON.parse(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    dispatch(authActions.setCredentials({ token, user: userParsed }));
  }

  dispatch(authActions.setHydrated(true));
};

function useAuth() {
  const dispatch = useAppDispatch();
  const { user, message, isHydrated } = useAppSelector((state) => state.auth);

  const signOut = useCallback(() => {
    if (isServer()) return;

    localStorage.removeItem('@DevFinder:token');
    localStorage.removeItem('@DevFinder:user');

    dispatch(authActions.signOut());
  }, [dispatch]);

  const socialAuthCallback = useCallback(({ token, user }: { token: string; user: UserData }) => {
    if (isServer()) return;

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    localStorage.setItem('@DevFinder:token', token);
    localStorage.setItem('@DevFinder:user', JSON.stringify(user));

    dispatch(authActions.setCredentials({ token, user }));
  }, [dispatch]);

  const setUser = useCallback((user: UserData) => {
    if (isServer()) return;

    localStorage.setItem('@DevFinder:user', JSON.stringify(user));

    dispatch(authActions.setUser(user));
  }, [dispatch]);

  return { user, setUser, signOut, socialAuthCallback, message, isHydrated };
}

export { useAuth };
