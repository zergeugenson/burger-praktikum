import { describe, it, expect } from 'vitest';

import {
  profileOrdersSlice,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOpen,
  profileOrdersClosed,
  profileOrdersError,
  profileOrdersMessage,
  selectProfileOrders,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
  type TProfileOrdersState,
} from './profile-orders-slice';
import type { TFeedMessage, TIngredient } from '@/utils/api';

const fakeIngredient = (id: string): TIngredient => ({
  _id: id,
  name: '',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: '',
  __v: 0,
});

const mockMessage: TFeedMessage = {
  success: true,
  orders: [
    {
      _id: 'order-1',
      ingredients: [fakeIngredient('ing-1')],
      status: 'done',
      number: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      _id: 'order-2',
      ingredients: [fakeIngredient('ing-2')],
      status: 'pending',
      number: 2,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      _id: 'order-3',
      ingredients: [fakeIngredient('ing-3')],
      status: 'done',
      number: 3,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    },
  ],
  total: 100,
  totalToday: 10,
};

const initialState: TProfileOrdersState = profileOrdersSlice.getInitialState();

describe('profileOrdersSlice', () => {
  describe('начальное состояние', () => {
    it('должно быть корректным', () => {
      const state = profileOrdersSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('profileOrdersConnect', () => {
    it('ставит status=connecting, error=null', () => {
      const state = profileOrdersSlice.reducer(undefined, profileOrdersConnect());
      expect(state.status).toBe('connecting');
      expect(state.error).toBeNull();
    });
  });

  describe('profileOrdersDisconnect', () => {
    it('ставит status=idle', () => {
      const open = { ...initialState, status: 'open' as const };
      const state = profileOrdersSlice.reducer(open, profileOrdersDisconnect());
      expect(state.status).toBe('idle');
    });
  });

  describe('profileOrdersOpen', () => {
    it('ставит status=open, error=null', () => {
      const state = profileOrdersSlice.reducer(undefined, profileOrdersOpen());
      expect(state.status).toBe('open');
      expect(state.error).toBeNull();
    });
  });

  describe('profileOrdersClosed', () => {
    it('ставит status=closed', () => {
      const state = profileOrdersSlice.reducer(undefined, profileOrdersClosed());
      expect(state.status).toBe('closed');
    });
  });

  describe('profileOrdersError', () => {
    it('ставит status=error и message', () => {
      const state = profileOrdersSlice.reducer(
        undefined,
        profileOrdersError('Network error')
      );
      expect(state.status).toBe('error');
      expect(state.error).toBe('Network error');
    });
  });

  describe('profileOrdersMessage', () => {
    it('заполняет orders, total, totalToday', () => {
      const state = profileOrdersSlice.reducer(
        undefined,
        profileOrdersMessage(mockMessage)
      );
      expect(state.orders).toHaveLength(3);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });

    it('инвертирует orders — новые сверху', () => {
      const state = profileOrdersSlice.reducer(
        undefined,
        profileOrdersMessage(mockMessage)
      );

      expect(state.orders[0]._id).toBe('order-3');
      expect(state.orders[1]._id).toBe('order-2');
      expect(state.orders[2]._id).toBe('order-1');
    });

    it('заменяет старые orders новыми', () => {
      const stateWithOld: TProfileOrdersState = {
        ...initialState,
        orders: [
          {
            _id: 'old-order',
            ingredients: [fakeIngredient('old')],
            status: 'done',
            number: 999,
            createdAt: '',
            updatedAt: '',
          },
        ],
      };
      const state = profileOrdersSlice.reducer(
        stateWithOld,
        profileOrdersMessage(mockMessage)
      );
      expect(state.orders.find((o) => o._id === 'old-order')).toBeUndefined();
      expect(state.orders).toHaveLength(3);
    });
  });

  describe('селекторы', () => {
    const mockState = {
      profileOrders: {
        orders: mockMessage.orders,
        total: 100,
        totalToday: 10,
        status: 'open' as const,
        error: 'Test error',
      },
    } as never;

    it('selectProfileOrders возвращает orders', () => {
      expect(selectProfileOrders(mockState)).toHaveLength(3);
    });

    it('selectProfileOrdersStatus возвращает status', () => {
      expect(selectProfileOrdersStatus(mockState)).toBe('open');
    });

    it('selectProfileOrdersError возвращает error', () => {
      expect(selectProfileOrdersError(mockState)).toBe('Test error');
    });
  });
});
