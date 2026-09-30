import { createAsyncThunk } from '@reduxjs/toolkit';

import BurgerApi from '@utils/api';

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async (_payload, { rejectWithValue }) => {
    try {
      return await BurgerApi.getIngredients();
    } catch (error) {
      return rejectWithValue(BurgerApi.printError(error));
    }
  }
);
