import { createAsyncThunk } from '@reduxjs/toolkit';
import BurgerApi from '@utils/api';

export const fetchIngredients = createAsyncThunk (
    'ingredients/get',
    async (_payload,
    { rejectWithValue, signal }
    ) => {
  try {
    return await BurgerApi.getIngredients();
  } catch (error) {
    if (signal.aborted) {
      throw error;
    }
    return rejectWithValue(BurgerApi.printError(error));
  }
});
