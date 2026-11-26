import { describe, it, expect } from 'vitest';

import {
  modalSlice,
  openModal,
  closeModal,
  MODAL_TYPES,
  type TModalState,
} from './modal-slice';

describe('modalSlice', () => {
  const initialState: TModalState = {
    type: null,
    data: null,
    title: null,
  };

  describe('начальное состояние', () => {
    it('должно быть корректным', () => {
      const state = modalSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('openModal', () => {
    it('устанавливает type, data, title', () => {
      const action = openModal({
        type: MODAL_TYPES.ORDER_DETAILS,
        title: 'Заказ',
      });
      const state = modalSlice.reducer(initialState, action);

      expect(state.type).toBe(MODAL_TYPES.ORDER_DETAILS);
      expect(state.data).toBeNull();
      expect(state.title).toBe('Заказ');
    });

    it('принимает data', () => {
      const data = { id: '123' };
      const action = openModal({
        type: MODAL_TYPES.INGREDIENT_DETAILS,
        data,
      });
      const state = modalSlice.reducer(initialState, action);

      expect(state.data).toBe(data);
      expect(state.title).toBeNull();
    });
  });

  describe('closeModal', () => {
    it('сбрасывает state в initial', () => {
      const open: TModalState = {
        type: MODAL_TYPES.ORDER_DETAILS,
        data: { foo: 'bar' },
        title: 'Заказ',
      };
      const state = modalSlice.reducer(open, closeModal());

      expect(state).toEqual(initialState);
    });
  });
});
