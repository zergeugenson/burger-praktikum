import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice.js';
import { ingredientsSlice } from './ingredients/ingredients-slice.js';
import { modalSlice } from './modal/modal-slice';
import { orderSlice } from './order/order-slice.js';

export const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  modalSlice,
  burgerConstructorSlice
);

export const store = configureStore({
  devTools: true,
  reducer: rootReducer,
});
