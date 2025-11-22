"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  session: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  session: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<any | null>) => {
      state.session = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
    },
  },
});

export const { setSession, setLoading, clearSession } = authSlice.actions;
export default authSlice.reducer;
