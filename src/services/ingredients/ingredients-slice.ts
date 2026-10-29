import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/api';
import { getIngredients } from './ingredients-actions';

export type TIngredientsState = {
  error: string | null;
  isLoading: boolean;
  items: TIngredient[];
};

const initialState: TIngredientsState = {
  error: null,
  isLoading: false,
  items: [],
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getIngredients.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(getIngredients.fulfilled, (state, action) => {
          state.isLoading = false;
          state.items = action.payload.data;
        })
        .addCase(getIngredients.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload ?? 'Ошибка загрузки';
        });
  },
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsError: (state) => state.error,
    selectIngredientsIsLoading: (state) => state.isLoading,
  },
});

export const {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} = ingredientsSlice.selectors;
