import { createSlice } from '@reduxjs/toolkit';
export const MODAL_TYPES = {
  ORDER_DETAILS: 'orderDetails',
  INGREDIENT_DETAILS: 'ingredientDetails',
};

const initialState = {
  type: null,
  data: null,
  title: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, data, title } = action.payload;
      state.type = type;
      state.data = data;
      state.title = title;
    },
    closeModal: () => initialState,
  },
});

export const { openModal, closeModal } = modalSlice.actions;
