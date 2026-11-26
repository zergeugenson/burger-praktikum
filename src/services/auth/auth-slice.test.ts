import { describe, it, expect } from 'vitest';

import { authSlice, type TAuthState } from './auth-slice';
import {
  userLogin,
  userRegister,
  getUserData,
  changeUserData,
  userLogout,
} from './auth-actions';
import type { TUser } from '@/utils/api';

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User',
};

const initialState: TAuthState = authSlice.getInitialState();

describe('authSlice', () => {
  describe('начальное состояние state', () => {
    it('должно быть корректным', () => {
      const state = authSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('userLogin', () => {
    it('pendin стfвит isLoading=true, error=null', () => {
      const action = userLogin.pending('req-1', {
        email: 'test@test.com',
        password: 'pass',
      });
      const state = authSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled стfвит user, isLoading=false, isAuthChecked=true', () => {
      const action = userLogin.fulfilled(mockUser, 'req-1', {
        email: 'test@test.com',
        password: 'pass',
      });
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected стfвит error, isLoading=false, isAuthChecked=true', () => {
      const action = userLogin.rejected(
        new Error('Login failed'),
        'req-1',
        { email: 'test@test.com', password: 'pass' },
        'Ошибка входа'
      );
      const state = authSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('userRegister', () => {
    it('fulfilled ставит user', () => {
      const action = userRegister.fulfilled(mockUser, 'req-1', {
        email: 'test@test.com',
        password: 'pass',
        name: 'Test',
      });
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected ставит error', () => {
      const action = userRegister.rejected(
        new Error('fail'),
        'req-1',
        { email: 'test@test.com', password: 'pass', name: 'Test' },
        'Регистрация не удалась'
      );
      const state = authSlice.reducer(initialState, action);

      expect(state.error).toBe('Регистрация не удалась');
    });
  });

  describe('getUserData', () => {
    it('залогинен, isAuthChecked=true', () => {
      const action = getUserData.fulfilled(mockUser, 'req-1');
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('пользователь не залогинен', () => {
      const action = getUserData.fulfilled(null, 'req-1');
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected ставит isAuthChecked=true', () => {
      const action = getUserData.rejected(new Error('fail'), 'req-1');
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('userLogout', () => {
    it('fulfilled сбрасывает user, ставит isAuthChecked=true', () => {
      const loggedIn: TAuthState = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true,
      };
      const action = userLogout.fulfilled(undefined, 'req-1');
      const state = authSlice.reducer(loggedIn, action);

      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('changeUserData', () => {
    it('fulfilled обновляет user', () => {
      const updated: TUser = { email: 'new@test.com', name: 'New Name' };
      const action = changeUserData.fulfilled(updated, 'req-1', {
        email: 'new@test.com',
        name: 'New Name',
      });
      const state = authSlice.reducer(initialState, action);

      expect(state.user).toEqual(updated);
    });
  });
});
