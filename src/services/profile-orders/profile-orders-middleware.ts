import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

import BurgerApi from '@utils/api';
import { getAccessToken, clearTokens } from '@utils/common';
import { WS_PROFILE_ORDERS_URL } from '@utils/constants';
import type { TFeedMessage } from '@/utils/api';

import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOpen,
  profileOrdersClosed,
  profileOrdersError,
  profileOrdersMessage,
} from './profile-orders-slice'
let socket: WebSocket | null = null;
let currentSocketId = 0;
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3; 

const buildUrl = (token: string): string => {
  // API требует передавать токен БЕЗ "Bearer " префикса — только JWT
  const cleanToken = token.replace(/^Bearer\s+/i, '');
  return `${WS_PROFILE_ORDERS_URL}?token=${cleanToken}`;
};

const connect = (store: MiddlewareAPI): void => {
  if (socket) {
    socket.close();
    socket = null;
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    store.dispatch(profileOrdersError('Нет access-токена — пользователь не залогинен'));
    return;
  }

  const mySocketId = ++currentSocketId;
  socket = new WebSocket(buildUrl(accessToken));

  socket.onopen = () => {
    if (mySocketId === currentSocketId) {
      store.dispatch(profileOrdersOpen());
      refreshAttempts = 0;        // ← сброс при успешном подключении
    }
  };

  socket.onclose = () => {
    if (mySocketId === currentSocketId) {
      store.dispatch(profileOrdersClosed());
    }
  };

  socket.onerror = () => {
    if (mySocketId === currentSocketId) {
      store.dispatch(profileOrdersError('Ошибка WebSocket-соединения'));
    }
  };

  socket.onmessage = async (event) => {
    if (mySocketId !== currentSocketId) return;

    let data: unknown;
    try {
      data = JSON.parse(event.data);
    } catch {
      store.dispatch(profileOrdersError('Невалидный JSON от сервера'));
      return;
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      (data as { message: string }).message === 'Invalid or missing token'
    ) {
      // Защита от бесконечного цикла
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        clearTokens();
        store.dispatch(
          profileOrdersError('Не удалось подключиться после нескольких попыток. Войдите снова.')
        );
        return;
      }

      if (isRefreshing) return;
      isRefreshing = true;
      refreshAttempts++;

      try {
        await BurgerApi.refreshAccessToken();
        isRefreshing = false;
        connect(store);   // retry с новым токеном
      } catch {
        isRefreshing = false;
        clearTokens();
        store.dispatch(profileOrdersError('Сессия истекла. Войдите снова.'));
      }
      return;
    }

    // Обычное сообщение — сбрасываем счётчик refresh-попыток
    refreshAttempts = 0;
    store.dispatch(profileOrdersMessage(data as TFeedMessage));
  };
};

const disconnect = (): void => {
  currentSocketId++;  // инвалидируем все обработчики
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const profileOrdersMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (profileOrdersConnect.match(action)) {
      connect(store);
    }

    if (profileOrdersDisconnect.match(action)) {
      disconnect();
    }

    return next(action);
  };
  