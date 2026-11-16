import type { Middleware, MiddlewareAPI } from '@reduxjs';
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

export const feedMiddleware: Middleware =
  (store: MiddlewareAPI) => (next) => (action) => {
    if (feedConnect.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }

      socket = new WebSocket(WS_FEED_URL);

      socket.onopen = () => {
        store.dispatch(feedOpen());
      };

      socket.onclose = () => {
        store.dispatch(feedClosed());
      };

      socket.onerror = () => {
        store.dispatch(feedError('Ошибка WebSocket-соединения'));
      };

      socket.onmessage = (event) => {
        try {
          const data: TFeedMessage = JSON.parse(event.data);
          store.dispatch(feedMessage(data));
        } catch {
          store.dispatch(feedError('Невалидный JSON от сервера'));
        }
      };
    }

    if (feedDisconnect.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };