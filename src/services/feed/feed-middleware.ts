import { createSocketMiddleware } from '../socket-middleware';
import { WS_FEED_URL } from '@utils/constants';
import type { TFeedMessage } from '@/utils/api';

import {
  feedConnect,
  feedDisconnect,
  feedOpen,
  feedClosed,
  feedError,
  feedMessage,
} from './feed-slice';

export const feedMiddleware = createSocketMiddleware<TFeedMessage>({
  actions: {
    connect: feedConnect,
    disconnect: feedDisconnect,
    onOpen: feedOpen,
    onClose: feedClosed,
    onError: feedError,
    onMessage: feedMessage,
  },
  buildUrl: () => WS_FEED_URL,
});
