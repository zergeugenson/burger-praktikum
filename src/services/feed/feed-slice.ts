import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TFeedMessage, TFeedOrder } from '@/utils/api';

export type TFeedStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export type TFeedState = {
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
  status: TFeedStatus;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedConnect: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    feedDisconnect: (state) => {
      state.status = 'idle';
    },
    feedOpen: (state) => {
      state.status = 'open';
      state.error = null;
    },
    feedClosed: (state) => {
      state.status = 'closed';
    },
    feedError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    feedMessage: (state, action: PayloadAction<TFeedMessage>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    },
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedStatus: (state) => state.status,
    selectFeedError: (state) => state.error,
  },
});

export const {
  feedConnect,
  feedDisconnect,
  feedOpen,
  feedClosed,
  feedError,
  feedMessage,
} = feedSlice.actions;

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} = feedSlice.selectors;

export default feedSlice.reducer;
