import { useCallback } from 'react';

import { isServer } from '../utils';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { themeActions, ThemeAlias } from '../store/slices/themeSlice';
import type { AppDispatch } from '../store';

// Mesma lógica do script bloqueante em app/layout.tsx (localStorage, com fallback pra
// prefers-color-scheme na primeira visita) — precisa ficar em sincronia com ele pra o estado do
// Redux (usado pelo botão de alternância em components/Footer) bater com o atributo já aplicado
// no <html> antes do paint.
const readStoredOrSystemAlias = (): ThemeAlias => {
  const stored = localStorage.getItem('@DevFinder:theme');
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const hydrateTheme = () => (dispatch: AppDispatch) => {
  if (isServer()) return;

  const alias = readStoredOrSystemAlias();

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
    // as variáveis CSS reais (styles/GlobalStyle.ts) são lidas via este atributo, não via
    // props.theme do styled-components — atualizar aqui troca as cores na hora, sem esperar
    // o Redux propagar a mudança em setAlias abaixo.
    document.documentElement.setAttribute('data-theme', next);

    dispatch(themeActions.setAlias(next));
  }, [dispatch, alias]);

  return { alias, switchAlias, isHydrated };
}

export { useStyleSwitcher };
