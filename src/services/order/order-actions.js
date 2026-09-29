import { createAsyncThunk } from '@reduxjs/toolkit';
import BurgerApi from '@utils/api';

export const createOrder = createAsyncThunk (
    'order/create',
    async (_payload, { rejectWithValue }
    ) => {
        try {
            return await BurgerApi.createOrder(_payload);
        } catch (error) {
            return rejectWithValue(BurgerApi.printError(error));
        }
    });
