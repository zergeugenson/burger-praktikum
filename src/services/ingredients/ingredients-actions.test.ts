import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { ThunkDispatch } from 'redux-thunk';
import type { UnknownAction } from 'redux';

import { getIngredients } from './ingredients-actions';
import { ingredientsSlice, type TIngredientsState } from './ingredients-slice';
import BurgerApi from '@utils/api';
import type { TIngredient, TGetIngredientsResponse } from '@utils/api';

vi.mock('@utils/api', () => ({
  default: {
    getIngredients: vi.fn(),
  },
}));

type TTestState = { ingredients: TIngredientsState };
type TTestDispatch = ThunkDispatch<TTestState, undefined, UnknownAction>;

const mockIngredient: TIngredient = {
  _id: 'ing-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 100,
  price: 50,
  image: 'img.png',
  image_large: 'img-large.png',
  image_mobile: 'img-mobile.png',
  __v: 0,
};

const mockResponse: TGetIngredientsResponse = {
  success: true,
  data: [
    mockIngredient,
    { ...mockIngredient, _id: 'ing-2', name: 'Соус', type: 'sauce' },
  ],
};

describe('getIngredients thunk', () => {
  let dispatch: TTestDispatch;
  let getState: () => TTestState;

  beforeEach(() => {
    vi.clearAllMocks();

    const store = configureStore({
      reducer: { ingredients: ingredientsSlice.reducer },
    });

    dispatch = store.dispatch as TTestDispatch;
    getState = () => store.getState() as TTestState;
  });

  it('на успехе: заполняет items, isLoading=false', async () => {
    vi.mocked(BurgerApi.getIngredients).mockResolvedValue(mockResponse);

    await dispatch(getIngredients());

    const state = getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items[0]._id).toBe('ing-1');
    expect(state.items[1].name).toBe('Соус');
    expect(state.error).toBeNull();
  });

  it('на ошибке Error: ставит error с message', async () => {
    vi.mocked(BurgerApi.getIngredients).mockRejectedValue(new Error('Network error'));

    await dispatch(getIngredients());

    const state = getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.items).toEqual([]);
  });

  it('на ошибке не-Error: fallback сообщение', async () => {
    vi.mocked(BurgerApi.getIngredients).mockRejectedValue('что-то странное');

    await dispatch(getIngredients());

    const state = getState().ingredients;
    expect(state.error).toBe('Не удалось получить ингредиенты');
  });
});
