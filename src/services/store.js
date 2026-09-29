import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from './ingredients-slice';

export const rootReducer = combineSlices(
	ingredientsSlice,
);

export const store = configureStore({
	devTools: true,
	reducer: rootReducer,
});
