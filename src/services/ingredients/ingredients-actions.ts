import { createAsyncThunk } from '@reduxjs/toolkit';

import BurgerApi from '@utils/api';
import type { TGetIngredientsResponse } from '@utils/api';

type TThunkConfig = { rejectValue: string };

const getErrorMessage = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;

export const getIngredients = createAsyncThunk<
        TGetIngredientsResponse,
    void,
    TThunkConfig
>('ingredients/get', async (_, { rejectWithValue }) => {
    try {
        return await BurgerApi.getIngredients();
    } catch (error) {
        return rejectWithValue(
            getErrorMessage(error, 'Не удалось получить ингредиенты')
        );
    }
});
