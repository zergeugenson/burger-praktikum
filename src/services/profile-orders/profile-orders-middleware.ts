import { createSocketMiddleware } from '../socket-middleware';
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
} from './profile-orders-slice';

export const profileOrdersMiddleware = createSocketMiddleware<TFeedMessage>({
  actions: {
    connect: profileOrdersConnect,
    disconnect: profileOrdersDisconnect,
    onOpen: profileOrdersOpen,
    onClose: profileOrdersClosed,
    onError: profileOrdersError,
    onMessage: profileOrdersMessage,
  },
  buildUrl: () => {
    const token = getAccessToken();
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    return `${WS_PROFILE_ORDERS_URL}?token=${cleanToken}`;
  },
  onAuthError: async (): Promise<boolean> => {
    try {
      await BurgerApi.refreshAccessToken();
      return true;
    } catch {
      clearTokens();
      return false;
    }
  },
});
