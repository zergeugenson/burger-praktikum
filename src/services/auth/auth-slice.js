import { createSlice } from '@reduxjs/toolkit';

import {
	userLogin,
	userLogout,
	userRegister,
	getUserData,
} from './auth-actions';

const initialState= {
	error: null,
	isLoading: false,
	isAuthChecked: false,
	user: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
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
				state.error = action.payload ?? null;
			})
			.addCase(getUserData.pending, (state) => {
				state.error = null;
			})
			.addCase(getUserData.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isAuthChecked = true;
			})
			.addCase(getUserData.rejected, (state) => {
				state.user = null;
				state.isAuthChecked = true;
			})
	},
	selectors: {
		selectError: (state) => state.error,
		selectIsLoading: (state) => state.isLoading,
		selectIsAuthChecked: (state) => state.isAuthChecked,
		selectUser: (state) => state.user,
	},
});

export const { selectError, selectIsLoading, selectIsAuthChecked, selectUser } = authSlice.selectors;
