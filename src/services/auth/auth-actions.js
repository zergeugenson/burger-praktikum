// auth-actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import BurgerApi from '@utils/api';
import { setTokens, clearTokens, getRefreshToken } from '@/utils/common.js';

export const userLogin = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userLogin(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Не удалось войти');
	}
});

export const userRegister = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userRegister(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Ошибка регистрации');
	}
});

export const getUserData = createAsyncThunk('auth/getUserData', async (payload, { rejectWithValue }) => {
	if (!getRefreshToken()) return null;
	try {
		return await BurgerApi.getUserData(payload);
	} catch (error) {
		clearTokens();
		return rejectWithValue(error?.message ?? 'Ошибка данных пользователя');
	}
});

export const userLogout = createAsyncThunk('auth/logout', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userLogout(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Ошибка выхода');
	}
});

export const changeUserData = createAsyncThunk('auth/changeUserData', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.changeUserData(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Ошибка изменения данных пользователя');
	}
});

export const LostPasswordStepOne = createAsyncThunk('auth/LostPasswordStepOne', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.LostPasswordStepOne(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Ошибка восстановления пароля');
	}
});

export const LostPasswordStepTwo = createAsyncThunk('auth/LostPasswordStepTwo', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.LostPasswordStepTwo(payload);
	} catch (error) {
		return rejectWithValue(error?.message ?? 'Ошибка восстановления пароля');
	}
});
