import { describe, it, expect } from 'vitest';

import { orderSlice, clearOrder, type TOrderState } from './order-slice';
import { createOrder } from './order-actions';

describe('orderSlice', () => {
  const initialState: TOrderState = orderSlice.getInitialState();

  describe('начальное состояние', () => {
    it('должно быть корректным', () => {
      const state = orderSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('createOrder', () => {
    it('pending: isLoading=true, error=null, number=null', () => {
      const action = createOrder.pending('req-1', ['ing-1', 'ing-2']);
      const state = orderSlice.reducer(undefined, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.number).toBeNull();
    });

    it('fulfilled: ставит number из ответа', () => {
      const action = createOrder.fulfilled(
        {
          success: true,
          name: 'Test Burger',
          order: { number: 12345 },
        },
        'req-1',
        ['ing-1', 'ing-2']
      );
      const state = orderSlice.reducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.number).toBe(12345);
    });

    it('rejected: ставит error', () => {
      const action = createOrder.rejected(
        new Error('fail'),
        'req-1',
        ['ing-1'],
        'Не удалось создать заказ'
      );
      const state = orderSlice.reducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Не удалось создать заказ');
    });
  });

  describe('clearOrder', () => {
    it('сбрасывает state в initial', () => {
      const stateWithOrder: TOrderState = {
        error: null,
        isLoading: false,
        number: 12345,
      };
      const state = orderSlice.reducer(stateWithOrder, clearOrder());

      expect(state).toEqual(initialState);
    });
  });
});
