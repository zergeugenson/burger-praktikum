import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/auth-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { modalSlice } from './modal/modal-slice';
import { orderSlice } from './order/order-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  modalSlice,
  burgerConstructorSlice,
  authSlice
);

export const store = configureStore({
  devTools: true,
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
