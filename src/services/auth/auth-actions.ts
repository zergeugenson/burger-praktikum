import { createAsyncThunk } from '@reduxjs/toolkit';

import { clearTokens, getRefreshToken } from '@utils/common';
import BurgerApi from '@utils/api';
import type {
    TUser,
    TLoginPayload,
    TRegisterPayload,
    TChangeUserDataPayload,
    TLostPasswordStepOnePayload,
    TLostPasswordStepTwoPayload,
} from '@utils/api';

const getErrorMessage = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;

export const userLogin = createAsyncThunk<TUser, TLoginPayload, { rejectValue: string }>('auth/login', async (payload:TLoginPayload, { rejectWithValue }) => {
    try {
        return await BurgerApi.userLogin(payload);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Не удалось войти'));
    }
});

export const userRegister = createAsyncThunk<TUser, TRegisterPayload, { rejectValue: string }>('auth/register', async (payload:TRegisterPayload, { rejectWithValue }) => {
    try {
        return await BurgerApi.userRegister(payload);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Ошибка регистрации'));
    }
});

export const getUserData = createAsyncThunk<TUser | null, void, { rejectValue: string }>('auth/getUserData', async (_, { rejectWithValue }) => {
    if (!getRefreshToken()) return null;
    try {
        return await BurgerApi.getUserData();
    } catch (error) {
        clearTokens();
        return rejectWithValue(getErrorMessage(error, 'Ошибка данных пользователя'));
    }
});

export const userLogout = createAsyncThunk<void, void, { rejectValue: string }>('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await BurgerApi.userLogout();
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Ошибка выхода'));
    }
});

export const changeUserData = createAsyncThunk<TUser, TChangeUserDataPayload, { rejectValue: string }>('auth/changeUserData', async (payload:TChangeUserDataPayload, { rejectWithValue }) => {
    try {
        return await BurgerApi.changeUserData(payload);
    } catch (error) {
        return rejectWithValue(
            getErrorMessage(error, 'Ошибка изменения данных пользователя')
        );
    }
});

export const LostPasswordStepOne = createAsyncThunk<boolean, TLostPasswordStepOnePayload, { rejectValue: string }>('auth/LostPasswordStepOne', async (payload:TLostPasswordStepOnePayload, { rejectWithValue }) => {
    try {
        return await BurgerApi.LostPasswordStepOne(payload);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Ошибка восстановления пароля'));
    }
});

export const LostPasswordStepTwo = createAsyncThunk<boolean, TLostPasswordStepTwoPayload, { rejectValue: string }>('auth/LostPasswordStepTwo', async (payload:TLostPasswordStepTwoPayload, { rejectWithValue }) => {
    try {
        return await BurgerApi.LostPasswordStepTwo(payload);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Ошибка восстановления пароля'));
    }
});
