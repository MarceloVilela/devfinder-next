import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  likes: string[];
  deslikes: string[];
  follow: string[];
  ignore: string[];
  _id: string;
  name: string;
  user: string;
  bio?: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: UserData;
  message: { content?: string; type?: string };
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: {} as UserData,
  message: {},
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload;
    },
    signOut(state) {
      state.user = {} as UserData;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
