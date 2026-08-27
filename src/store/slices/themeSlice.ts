import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeAlias = 'dark' | 'light';

interface ThemeState {
  alias: ThemeAlias;
  isHydrated: boolean;
}

const initialState: ThemeState = {
  alias: 'dark',
  isHydrated: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setAlias(state, action: PayloadAction<ThemeAlias>) {
      state.alias = action.payload;
    },
    toggleAlias(state) {
      state.alias = state.alias === 'dark' ? 'light' : 'dark';
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
