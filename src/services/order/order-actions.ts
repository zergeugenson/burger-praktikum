import { createAsyncThunk } from '@reduxjs/toolkit';

import BurgerApi from '@utils/api';
import type { TCreateOrderResponse } from '@utils/api';

type TThunkConfig = { rejectValue: string };

const getErrorMessage = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;

export const createOrder = createAsyncThunk<
    TCreateOrderResponse,
    string[],
    TThunkConfig
    >('order/create', async (ingredientIds, { rejectWithValue }) => {
    try {
        return await BurgerApi.createOrder(ingredientIds);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, 'Не удалось сделать заказ'));
    }
});
