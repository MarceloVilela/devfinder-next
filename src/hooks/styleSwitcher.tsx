import { useCallback } from 'react';

import { isServer } from '../utils';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { themeActions, ThemeAlias } from '../store/slices/themeSlice';
import type { AppDispatch } from '../store';

export const hydrateTheme = () => (dispatch: AppDispatch) => {
  if (isServer()) return;

  const alias = (localStorage.getItem('@DevFinder:theme') as ThemeAlias) || 'dark';

  dispatch(themeActions.setAlias(alias));
  dispatch(themeActions.setHydrated(true));
};

function useStyleSwitcher() {
  const dispatch = useAppDispatch();
  const { alias, isHydrated } = useAppSelector((state) => state.theme);

  const switchAlias = useCallback(() => {
    if (isServer()) return;

    const next: ThemeAlias = alias === 'dark' ? 'light' : 'dark';

    localStorage.setItem('@DevFinder:theme', next);

    dispatch(themeActions.setAlias(next));
  }, [dispatch, alias]);

  return { alias, switchAlias, isHydrated };
}

export { useStyleSwitcher };
