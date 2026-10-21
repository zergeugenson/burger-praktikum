import { createSlice } from '@reduxjs/toolkit';

import {
	userLogin,
	userRegister,
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
				state.error = action.payload ? 'Ошибка регистрации' : null;
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
				state.error = action.payload ? 'Ошибка входа' : null;
			})
	},
	selectors: {
		selectError: (state) => state.error,
		selectIsLoading: (state) => state.isLoading,
		selectIsAuthChecked: (state) => state.isAuthChecked,
	},
});

export const { selectError, selectIsLoading, selectIsAuthChecked } = authSlice.selectors;
