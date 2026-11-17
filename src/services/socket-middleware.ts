import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

type TSocketActions<TMessage> = {
  connect: ActionCreatorWithPayload<void, string>;
  disconnect: ActionCreatorWithPayload<void, string>;
  onOpen: ActionCreatorWithPayload<void, string>;
  onClose: ActionCreatorWithPayload<void, string>;
  onError: ActionCreatorWithPayload<string, string>;
  onMessage: ActionCreatorWithPayload<TMessage, string>;
};

type TSocketMiddlewareOptions<TMessage> = {
  actions: TSocketActions<TMessage>;
  buildUrl: () => string | null;
  onAuthError?: () => Promise<boolean>;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
};

export const createSocketMiddleware = <TMessage>(
  options: TSocketMiddlewareOptions<TMessage>
): Middleware => {
  const {
    actions,
    buildUrl,
    onAuthError,
    reconnectDelay = 3000,
    maxReconnectAttempts = 3,
  } = options;

  let socket: WebSocket | null = null;
  let currentSocketId = 0;
  let reconnectAttempts = 0;
  let isRefreshing = false;

  const connect = (store: MiddlewareAPI): void => {
    if (socket) {
      socket.close();
      socket = null;
    }

    const url = buildUrl();
    if (!url) {
      store.dispatch(actions.onError('Не удалось построить URL для подключения'));
      return;
    }

    const mySocketId = ++currentSocketId;
    socket = new WebSocket(url);

    socket.onopen = () => {
      if (mySocketId === currentSocketId) {
        store.dispatch(actions.onOpen());
        reconnectAttempts = 0;
      }
    };

    socket.onclose = () => {
      if (mySocketId !== currentSocketId) return;
      store.dispatch(actions.onClose());

      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(() => {
          if (mySocketId === currentSocketId) {
            store.dispatch(actions.connect());
          }
        }, reconnectDelay);
      }
    };

    socket.onerror = () => {
      if (mySocketId === currentSocketId) {
        store.dispatch(actions.onError('Ошибка WebSocket-соединения'));
      }
    };

    socket.onmessage = async (event) => {
      if (mySocketId !== currentSocketId) return;

      let data: unknown;
      try {
        data = JSON.parse(event.data);
      } catch {
        store.dispatch(actions.onError('Невалидный JSON от сервера'));
        return;
      }

      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        (data as { message: string }).message === 'Invalid or missing token'
      ) {

        if (!onAuthError) {
          store.dispatch(actions.onError('Токен невалиден'));
          return;
        }

        if (reconnectAttempts >= maxReconnectAttempts) {
          store.dispatch(
            actions.onError(
              'Не удалось подключиться после нескольких попыток. Войдите снова.'
            )
          );
          return;
        }

        if (isRefreshing) return;
        isRefreshing = true;
        reconnectAttempts++;

        try {
          const success = await onAuthError();
          isRefreshing = false;
          if (success) {
            connect(store);
          } else {
            store.dispatch(actions.onError('Сессия истекла. Войдите снова.'));
          }
        } catch {
          isRefreshing = false;
          store.dispatch(actions.onError('Сессия истекла. Войдите снова.'));
        }
        return;
      }
      reconnectAttempts = 0;
      store.dispatch(actions.onMessage(data as TMessage));
    };
  };

  const disconnect = (): void => {
    currentSocketId++;
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  return (store) => (next) => (action) => {
    if (actions.connect.match(action)) {
      connect(store);
    }

    if (actions.disconnect.match(action)) {
      disconnect();
    }

    return next(action);
  };
};