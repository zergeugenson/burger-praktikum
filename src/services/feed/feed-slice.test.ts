import { describe, it, expect } from 'vitest';

import {
  feedSlice,
  feedOpen,
  feedClosed,
  feedError,
  feedMessage,
  feedConnect,
} from './feed-slice';
import type { TFeedMessage } from '@/utils/api';

const mockMessage = {
  success: true,
  orders: [
    {
      _id: 'order-1',
      ingredients: ['ing-1', 'ing-2'],
      status: 'done',
      number: 123,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  total: 100,
  totalToday: 10,
} as unknown as TFeedMessage;

describe('feedSlice', () => {
  describe('начальное состояние', () => {
    it('должно быть пустым', () => {
      const state = feedSlice.reducer(undefined, { type: 'unknown' });
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
      expect(state.status).toBe('idle');
      expect(state.error).toBeNull();
    });
  });

  describe('feedConnect', () => {
    it('ставит status=connecting', () => {
      const state = feedSlice.reducer(undefined, feedConnect());
      expect(state.status).toBe('connecting');
      expect(state.error).toBeNull();
    });
  });

  describe('feedOpen', () => {
    it('ставит status=open', () => {
      const state = feedSlice.reducer(undefined, feedOpen());
      expect(state.status).toBe('open');
    });
  });

  describe('feedMessage', () => {
    it('заполняет orders, total, totalToday из сообщения', () => {
      const state = feedSlice.reducer(undefined, feedMessage(mockMessage));
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]._id).toBe('order-1');
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
    });
  });

  describe('feedError', () => {
    it('ставит status=error и message', () => {
      const state = feedSlice.reducer(undefined, feedError('Network error'));
      expect(state.status).toBe('error');
      expect(state.error).toBe('Network error');
    });
  });

  describe('feedClosed', () => {
    it('ставит status=closed', () => {
      const state = feedSlice.reducer(undefined, feedClosed());
      expect(state.status).toBe('closed');
    });
  });
});
