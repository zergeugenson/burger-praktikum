import { createAction } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSocketMiddleware } from './socket-middleware';

type TestMessage = { orders: number[] };
type Options = Parameters<typeof createSocketMiddleware<TestMessage>>[0];

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  url: string;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: { data: string }) => Promise<void> | void) | null = null;
  close = vi.fn();

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }
}

const lastSocket = (): FakeWebSocket => FakeWebSocket.instances.at(-1)!;

const emitMessage = (socket: FakeWebSocket, payload: unknown) =>
  socket.onmessage!({ data: JSON.stringify(payload) });

const setup = (overrides: Partial<Omit<Options, 'actions'>> = {}) => {
  const actions = {
    connect: createAction('socket/connect'),
    disconnect: createAction('socket/disconnect'),
    onOpen: createAction('socket/onOpen'),
    onClose: createAction('socket/onClose'),
    onError: createAction<string>('socket/onError'),
    onMessage: createAction<TestMessage>('socket/onMessage'),
  };

  const buildUrl = vi.fn<() => string | null>(() => 'wss://test/orders');

  const middleware = createSocketMiddleware<TestMessage>({
    actions: actions as unknown as Options['actions'],
    buildUrl,
    ...overrides,
  });

  const next = vi.fn((action: unknown) => action);
  const api = { dispatch: vi.fn(), getState: vi.fn() };
  const handler = middleware(api as never)(next);
  api.dispatch.mockImplementation((action: unknown) => handler(action as never));

  return { actions, buildUrl, next, api, handler };
};

describe('createSocketMiddleware', () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    vi.stubGlobal('WebSocket', FakeWebSocket);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('прокидывание экшенов', () => {
    it('передаёт любой экшен в next и возвращает его результат', () => {
      const { handler, next } = setup();
      const action = { type: 'some/other' };
      const result = handler(action);

      expect(next).toHaveBeenCalledWith(action);
      expect(result).toBe(action);
      expect(FakeWebSocket.instances).toHaveLength(0);
    });

    it('передаёт в next и экшен connect', () => {
      const { handler, next, actions } = setup();

      handler(actions.connect());
      expect(next).toHaveBeenCalledWith(actions.connect());
    });
  });

  describe('connect', () => {
    it('создаёт WebSocket с url из buildUrl', () => {
      const { handler, actions, buildUrl } = setup();

      handler(actions.connect());

      expect(buildUrl).toHaveBeenCalledTimes(1);
      expect(FakeWebSocket.instances).toHaveLength(1);
      expect(lastSocket().url).toBe('wss://test/orders');
    });

    it('диспатчит onError и не создаёт сокет, если buildUrl вернул null', () => {
      const { handler, actions, api, buildUrl } = setup();
      buildUrl.mockReturnValue(null);

      handler(actions.connect());

      expect(FakeWebSocket.instances).toHaveLength(0);
      expect(api.dispatch).toHaveBeenCalledWith(
        actions.onError('Не удалось построить URL для подключения')
      );
    });

    it('закрывает предыдущий сокет при повторном connect', () => {
      const { handler, actions } = setup();

      handler(actions.connect());
      const first = lastSocket();
      handler(actions.connect());

      expect(first.close).toHaveBeenCalledTimes(1);
      expect(FakeWebSocket.instances).toHaveLength(2);
    });
  });

  describe('события сокета', () => {
    it('onopen диспатчит onOpen', () => {
      const { handler, actions, api } = setup();

      handler(actions.connect());
      lastSocket().onopen!();

      expect(api.dispatch).toHaveBeenCalledWith(actions.onOpen());
    });

    it('onerror диспатчит onError', () => {
      const { handler, actions, api } = setup();

      handler(actions.connect());
      lastSocket().onerror!();

      expect(api.dispatch).toHaveBeenCalledWith(
        actions.onError('Ошибка WebSocket-соединения')
      );
    });

    it('onclose диспатчит onClose', () => {
      const { handler, actions, api } = setup();

      handler(actions.connect());
      lastSocket().onclose!();

      expect(api.dispatch).toHaveBeenCalledWith(actions.onClose());
    });
  });

  describe('onmessage', () => {
    it('диспатчит onMessage с распарсенными данными', async () => {
      const { handler, actions, api } = setup();
      const payload: TestMessage = { orders: [1, 2, 3] };

      handler(actions.connect());
      await emitMessage(lastSocket(), payload);

      expect(api.dispatch).toHaveBeenCalledWith(actions.onMessage(payload));
    });
  });

  describe('переподключение при закрытии', () => {
    it('переподключается через reconnectDelay', () => {
      const { handler, actions } = setup({ reconnectDelay: 1000 });

      handler(actions.connect());
      lastSocket().onclose!();

      vi.advanceTimersByTime(999);
      expect(FakeWebSocket.instances).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it('перестаёт переподключаться после maxReconnectAttempts', () => {
      const { handler, actions } = setup({
        reconnectDelay: 100,
        maxReconnectAttempts: 2,
      });

      handler(actions.connect());

      lastSocket().onclose!();
      vi.advanceTimersByTime(100);
      lastSocket().onclose!();
      vi.advanceTimersByTime(100);
      expect(FakeWebSocket.instances).toHaveLength(3);

      lastSocket().onclose!();
      vi.advanceTimersByTime(10_000);
      expect(FakeWebSocket.instances).toHaveLength(3);
    });

    it('не переподключается, если за время ожидания был disconnect', () => {
      const { handler, actions } = setup({ reconnectDelay: 100 });

      handler(actions.connect());
      lastSocket().onclose!();
      handler(actions.disconnect());

      vi.advanceTimersByTime(1000);
      expect(FakeWebSocket.instances).toHaveLength(1);
    });
  });

  describe('disconnect', () => {
    it('закрывает сокет', () => {
      const { handler, actions } = setup();

      handler(actions.connect());
      const socket = lastSocket();
      handler(actions.disconnect());

      expect(socket.close).toHaveBeenCalledTimes(1);
    });

    it('после disconnect можно подключиться заново', () => {
      const { handler, actions } = setup();

      handler(actions.connect());
      handler(actions.disconnect());
      handler(actions.connect());

      expect(FakeWebSocket.instances).toHaveLength(2);
    });
  });
});
