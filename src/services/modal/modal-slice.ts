import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const MODAL_TYPES = {
  ORDER_DETAILS: 'orderDetails',
  INGREDIENT_DETAILS: 'ingredientDetails',
} as const;

export type TModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export type TModalState = {
  type: TModalType | null;
  data: unknown;
  title: string | null;
};

type TOpenModalPayload = {
  type: TModalType;
  data?: unknown;
  title?: string;
};

const initialState: TModalState = {
  type: null,
  data: null,
  title: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<TOpenModalPayload>) => {
      const { type, data, title } = action.payload;
      state.type = type;
      state.data = data ?? null;
      state.title = title ?? null;
    },
    closeModal: () => initialState,
  },
});

export const { openModal, closeModal } = modalSlice.actions;
