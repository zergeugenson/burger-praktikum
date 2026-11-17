import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TFeedMessage, TFeedOrder } from '@/utils/api';

export type TProfileOrdersStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export type TProfileOrdersState = {
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
  status: TProfileOrdersStatus;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersConnect: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    profileOrdersDisconnect: (state) => {
      state.status = 'idle';
    },
    profileOrdersOpen: (state) => {
      state.status = 'open';
      state.error = null;
    },
    profileOrdersClosed: (state) => {
      state.status = 'closed';
    },
    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    profileOrdersMessage: (state, action: PayloadAction<TFeedMessage>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersTotal: (state) => state.total,
    selectProfileOrdersTotalToday: (state) => state.totalToday,
    selectProfileOrdersStatus: (state) => state.status,
    selectProfileOrdersError: (state) => state.error,
  },
});

export const {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersOpen,
  profileOrdersClosed,
  profileOrdersError,
  profileOrdersMessage,
} = profileOrdersSlice.actions;

export const {
  selectProfileOrders,
  selectProfileOrdersTotal,
  selectProfileOrdersTotalToday,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
} = profileOrdersSlice.selectors;