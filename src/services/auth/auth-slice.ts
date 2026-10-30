import { createSlice } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/api';
import {
  userLogin,
  userLogout,
  userRegister,
  getUserData,
  changeUserData,
  LostPasswordStepOne,
  LostPasswordStepTwo,
} from './auth-actions';

export type TAuthState = {
  error: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  user: TUser | null;
};

const initialState: TAuthState = {
  error: null,
  isLoading: false,
  isAuthChecked: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload ?? 'Ошибка входа';
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload ?? 'Ошибка выхода';
      })
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.payload ?? 'Ошибка получения данных пользователя';
      })
      .addCase(changeUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(changeUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.payload ?? 'Ошибка сохранения профиля';
      })
      .addCase(LostPasswordStepOne.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(LostPasswordStepOne.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(LostPasswordStepOne.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? 'Ошибка восстановления пароля: имейл юзера не найден';
      })
      .addCase(LostPasswordStepTwo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(LostPasswordStepTwo.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(LostPasswordStepTwo.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          'Ошибка восстановления пароля: какая-то ошибка на втором шаге';
      });
  },
  selectors: {
    selectError: (state) => state.error,
    selectIsLoading: (state) => state.isLoading,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
  },
});

export const { selectError, selectIsLoading, selectIsAuthChecked, selectUser } =
  authSlice.selectors;
