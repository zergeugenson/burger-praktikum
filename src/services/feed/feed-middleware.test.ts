import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import { feedMiddleware } from './feed-middleware';
import { feedSlice, feedConnect, type TFeedState } from './feed-slice';
import { WS_FEED_URL } from '@utils/constants';
import type { TIngredient } from '@/utils/api';

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onclose:
    | ((event: { code: number; reason: string; wasClean: boolean }) => void)
    | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;

  readyState = 0;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  close() {
    this.readyState = 3;
    this.onclose?.({ code: 1000, reason: '', wasClean: true });
  }

  receive(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  open() {
    this.readyState = 1;
    this.onopen?.();
  }

  serverClose() {
    this.readyState = 3;
    this.onclose?.({ code: 1000, reason: '', wasClean: true });
  }
}

const mockOrder = {
  ingredients: ['ing-1'],
  _id: 'order-1',
  status: 'done',
  number: 123,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  name: 'Test Burger',
  price: 100,
} as unknown as TIngredient;

describe('feedMiddleware', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);

    store = configureStore({
      reducer: { feed: feedSlice.reducer },
      middleware: (getDefault) => getDefault().concat(feedMiddleware),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const getFeedState = (): TFeedState => (store.getState() as { feed: TFeedState }).feed;

  it('принимает сообщение через mock-socket и обновляет store', () => {
    store.dispatch(feedConnect());
    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toBe(WS_FEED_URL);

    const socket = MockWebSocket.instances[0];
    socket.open();
    expect(getFeedState().status).toBe('open');

    socket.receive({
      success: true,
      orders: [mockOrder, { ...mockOrder, _id: '', name: '' }],
      total: 40,
      totalToday: 3,
    });

    const state = getFeedState();
    expect(state.orders).toHaveLength(2);
    expect(state.orders[0]._id).toBe('order-1');
    expect(state.orders[0].number).toBe(123);
    expect(state.orders[0].name).toBe('Test Burger');
    expect(state.orders[1]._id).toBe('');
    expect(state.total).toBe(40);
    expect(state.totalToday).toBe(3);
  });

  it('перестаёт переподключаться после 3 неудачных попыток', () => {
    store.dispatch(feedConnect());

    for (let i = 0; i < 3; i++) {
      const socket = MockWebSocket.instances[MockWebSocket.instances.length - 1];
      socket.serverClose();
      vi.advanceTimersByTime(3000);
    }

    const countAfter3 = MockWebSocket.instances.length;
    vi.advanceTimersByTime(30000); // проматываем 30 сек
    expect(MockWebSocket.instances.length).toBe(countAfter3);
  });
});
