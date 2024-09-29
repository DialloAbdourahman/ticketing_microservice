import { createSlice } from "@reduxjs/toolkit";

export type User = {
  id: string;
  email: string;
};

export type AuthInitialStateType = {
  user: User | null;
  loadingUser: boolean;
};

const initialState: AuthInitialStateType = {
  user: null,
  loadingUser: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: { payload: User | null }) {
      state.user = action.payload;
    },
    setLoadingUser(state, action: { payload: boolean }) {
      state.loadingUser = action.payload;
    },
  },
});

export const { setLoadingUser, setUser } = authSlice.actions;

export default authSlice.reducer;
