import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/auth-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { modalSlice } from './modal/modal-slice';
import { orderSlice } from './order/order-slice';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  modal: modalSlice.reducer,
  order: orderSlice.reducer,
});

export const store = configureStore({
  devTools: true,
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
