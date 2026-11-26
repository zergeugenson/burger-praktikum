import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import { profileOrdersMiddleware } from './profile-orders-middleware';
import {
  profileOrdersSlice,
  profileOrdersConnect,
  type TProfileOrdersState,
} from './profile-orders-slice';
import { WS_PROFILE_ORDERS_URL } from '@utils/constants';
import type { TFeedMessage } from '@/utils/api';

vi.mock('@utils/common', () => ({
  getAccessToken: vi.fn(),
  clearTokens: vi.fn(),
}));

vi.mock('@utils/api', () => ({
  default: {
    refreshAccessToken: vi.fn(),
  },
}));

import { getAccessToken } from '@utils/common';
import BurgerApi from '@utils/api';

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
}

const mockMessage: TFeedMessage = {
  success: true,
  orders: [
    {
      _id: 'order-1',
      ingredients: ['ing-1'],
      status: 'done',
      number: 123,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  total: 50,
  totalToday: 5,
} as unknown as TFeedMessage;

describe('profileOrdersMiddleware', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.useFakeTimers();
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
    vi.clearAllMocks();

    store = configureStore({
      reducer: { profileOrders: profileOrdersSlice.reducer },
      middleware: (getDefault) => getDefault().concat(profileOrdersMiddleware),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const getState = (): TProfileOrdersState =>
    (store.getState() as { profileOrders: TProfileOrdersState }).profileOrders;

  it('buildUrl убирает Bearer из токена', () => {
    vi.mocked(getAccessToken).mockReturnValue('Bearer eyJabc123token');

    store.dispatch(profileOrdersConnect());

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toBe(
      `${WS_PROFILE_ORDERS_URL}?token=eyJabc123token`
    );
    expect(MockWebSocket.instances[0].url).not.toContain('Bearer');
  });

  it('принимает сообщение и обновляет store', () => {
    vi.mocked(getAccessToken).mockReturnValue('Bearer eyJtoken');

    store.dispatch(profileOrdersConnect());
    MockWebSocket.instances[0].open();
    MockWebSocket.instances[0].receive(mockMessage);

    const state = getState();
    expect(state.orders).toHaveLength(1);
    expect(state.orders[0]._id).toBe('order-1');
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(5);
  });

  it('после refresh: reconnect с URL без Bearer', async () => {
    vi.mocked(getAccessToken).mockReturnValue('Bearer eyJoldToken');
    vi.mocked(BurgerApi.refreshAccessToken).mockResolvedValue(undefined);

    store.dispatch(profileOrdersConnect());
    const socket1 = MockWebSocket.instances[0];
    socket1.open();
    socket1.receive({ success: false, message: 'Invalid or missing token' });

    await vi.waitFor(() => {
      expect(MockWebSocket.instances.length).toBe(2);
    });

    expect(BurgerApi.refreshAccessToken).toHaveBeenCalledTimes(1);

    const reconnectUrl = MockWebSocket.instances[1].url;
    expect(reconnectUrl).not.toContain('Bearer');
    expect(reconnectUrl).toContain('token=eyJoldToken');
  });
});
