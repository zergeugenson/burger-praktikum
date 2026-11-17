import type { Middleware } from '@reduxjs/toolkit';
import { WS_FEED_URL } from '@utils/constants';

import {
  feedConnect,
  feedDisconnect,
  feedOpen,
  feedClosed,
  feedError,
  feedMessage,
} from './feed-slice';
import type { TFeedMessage } from '@/utils/api';

let socket: WebSocket | null = null;
let currentSocketId = 0;

export const feedMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (feedConnect.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }

      const mySocketId = ++currentSocketId;
      socket = new WebSocket(WS_FEED_URL);

      socket.onopen = () => {
        if (mySocketId === currentSocketId) {
          store.dispatch(feedOpen());
        }
      };

      socket.onclose = () => {
        if (mySocketId === currentSocketId) {
          store.dispatch(feedClosed());
          // Переподключение через 3 секунды
          setTimeout(() => {
            if (mySocketId === currentSocketId) {
              store.dispatch(feedConnect());
            }
          }, 3000);
        }
      };

      socket.onerror = () => {
        if (mySocketId === currentSocketId) {
          store.dispatch(feedError('Ошибка WebSocket-соединения'));
        }
      };

      socket.onmessage = (event) => {
        if (mySocketId !== currentSocketId) return;
        try {
          const data: TFeedMessage = JSON.parse(event.data);
          store.dispatch(feedMessage(data));
        } catch {
          store.dispatch(feedError('Невалидный JSON от сервера'));
        }
      };
    }

    if (feedDisconnect.match(action)) {
      currentSocketId++;
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };