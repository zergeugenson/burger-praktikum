import { describe, it, expect } from 'vitest';

import {
  ingredientsSlice,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
  type TIngredientsState,
} from './ingredients-slice';
import { getIngredients } from './ingredients-actions';
import type { TIngredient, TGetIngredientsResponse } from '@utils/api';

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

const initialState: TIngredientsState = ingredientsSlice.getInitialState();

// === Tests ===
describe('ingredientsSlice', () => {
  describe('начальное состояние', () => {
    it('должно быть корректным', () => {
      const state = ingredientsSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('getIngredients.pending', () => {
    it('ставит isLoading=true и очищает error', () => {
      const action = getIngredients.pending('req-1');
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getIngredients.fulfilled', () => {
    it('ставит items из payload.data и isLoading=false', () => {
      const action = getIngredients.fulfilled(mockResponse, 'req-1');
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toHaveLength(2);
      expect(state.items[0]._id).toBe('ing-1');
      expect(state.items[0].name).toBe('Булка');
      expect(state.items[1]._id).toBe('ing-2');
      expect(state.items[1].type).toBe('sauce');
    });
  });

  describe('getIngredients.rejected', () => {
    it('использует fallback сообщение, если payload нет', () => {
      const action = getIngredients.rejected(new Error('fail'), 'req-1');
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });
  });

  describe('селекторы', () => {
    const mockState = {
      ingredients: {
        error: 'Test error',
        isLoading: true,
        items: [mockIngredient],
      },
    } as never;

    it('selectIngredients возвращает items', () => {
      expect(selectIngredients(mockState)).toEqual([mockIngredient]);
    });

    it('selectIngredientsError возвращает error', () => {
      expect(selectIngredientsError(mockState)).toBe('Test error');
    });

    it('selectIngredientsIsLoading возвращает isLoading', () => {
      expect(selectIngredientsIsLoading(mockState)).toBe(true);
    });
  });
});
