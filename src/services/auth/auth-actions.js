import { createAsyncThunk } from '@reduxjs/toolkit';
import BurgerApi from '@utils/api';

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

