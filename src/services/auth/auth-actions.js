import { createAsyncThunk } from '@reduxjs/toolkit';
import BurgerApi from '@utils/api';
import {setTokens, clearTokens, getRefreshToken} from '@/utils/common.js'

export const userLogin = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userLogin(payload);
	} catch (error) {
		return rejectWithValue(BurgerApi.printError(error || 'Не удалось войти'));
	}
});

export const userRegister = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userRegister(payload);
	} catch (error) {
		return rejectWithValue(BurgerApi.printError(error || 'Ошибка регистрации'));
	}
});

export const getUserData = createAsyncThunk('auth/getUserData', async (payload, { rejectWithValue }) => {

	if (!getRefreshToken()) return null;

	try {
		return await BurgerApi.getUserData(payload);
	} catch (error) {
		clearTokens();
		return rejectWithValue(BurgerApi.printError(error || 'Ошибка данных пользователя'));
	}
});

export const userLogout = createAsyncThunk('auth/logout', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.userLogout(payload);
	} catch (error) {
		return rejectWithValue(BurgerApi.printError(error || 'Ошибка выхода'));
	}
});

export const changeUserData = createAsyncThunk('auth/changeUserData', async (payload, { rejectWithValue }) => {
	try {
		return await BurgerApi.changeUserData(payload);
	} catch (error) {
		return rejectWithValue(BurgerApi.printError(error || 'Ошибка изменения данных пользователя'));
	}
});
