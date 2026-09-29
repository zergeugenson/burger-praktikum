import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from './order-actions.js';

const initialState = {
  error: null,
  isLoading: false,
  number: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.number = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки';
      });
  },
  selectors: {
    selectOrderError: (state) => state.error,
    selectOrderIsLoading: (state) => state.isLoading,
    selectOrderNumber: (state) => state.number,
  },
});

export const { clearOrder } = orderSlice.actions;
export const {
  selectOrderError,
  selectOrderIsLoading,
  selectOrderNumber
} = orderSlice.selectors;
