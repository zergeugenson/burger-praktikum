import { combineSlices, configureStore } from '@reduxjs/toolkit';
import type { UnknownAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import { authSlice } from './auth/auth-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { feedSlice } from './feed/feed-slice';
import { feedMiddleware } from './feed/feed-middleware';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { modalSlice } from './modal/modal-slice';
import { orderSlice } from './order/order-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  modalSlice,
  burgerConstructorSlice,
  authSlice,
  feedSlice,
);

export const store = configureStore({
  devTools: true,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;