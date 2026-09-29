import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './ingredients/ingredients-slice.js';
import { orderSlice } from './order/order-slice.js';
import { modalSlice } from './modal/modal-slice';

export const rootReducer = combineSlices(
	ingredientsSlice,
	orderSlice,
	modalSlice,
);

export const store = configureStore({
	devTools: true,
	reducer: rootReducer,
});
