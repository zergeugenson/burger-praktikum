import { describe, it, expect } from 'vitest';

import {
  burgerConstructorSlice,
  addItem,
  removeItem,
  clearConstructor,
  type TBurgerConstructorState,
} from './burger-constructor-slice';
import type { TIngredient } from '@/utils/api';

const mockIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'ing-id',
  name: 'Test',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 100,
  price: 50,
  image: 'img.png',
  image_large: 'img-large.png',
  image_mobile: 'img-mobile.png',
  __v: 0,
  ...overrides,
});

const mockBun = (overrides: Partial<TIngredient> = {}): TIngredient =>
  mockIngredient({ type: 'bun', _id: 'bun-id', ...overrides });

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

describe('burgerConstructorSlice', () => {
  describe('начальное состояние', () => {
    it('должно быть пустым', () => {
      const state = burgerConstructorSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('addItem', () => {
    it('кладёт булку в конструктор', () => {
      const bun = mockBun();
      const action = addItem(bun);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.bun).not.toBeNull();
      expect(state.bun?._id).toBe('bun-id');
      expect(state.bun?.uid).toBeDefined();
    });

    it('кладёт начинки в ingredients', () => {
      const ingredient = mockIngredient();
      const action = addItem(ingredient);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('ing-id');
      expect(state.ingredients[0].uid).toBeDefined();
    });

    it('заменяет булку новой', () => {
      const bun1 = mockBun({ _id: 'bun-1' });
      const bun2 = mockBun({ _id: 'bun-2' });

      let state = burgerConstructorSlice.reducer(initialState, addItem(bun1));
      state = burgerConstructorSlice.reducer(state, addItem(bun2));

      expect(state.bun?._id).toBe('bun-2');
    });
  });

  describe('removeItem', () => {
    it('удаляет ингредиент по uid', () => {
      const ingredient = mockIngredient();
      const stateWithItem = burgerConstructorSlice.reducer(
        initialState,
        addItem(ingredient)
      );
      const uid = stateWithItem.ingredients[0].uid;

      const state = burgerConstructorSlice.reducer(stateWithItem, removeItem(uid));

      expect(state.ingredients).toHaveLength(0);
    });

    it('не удаляет булок', () => {
      const bun = mockBun();
      const stateWithBun = burgerConstructorSlice.reducer(initialState, addItem(bun));
      const uid = stateWithBun.bun!.uid;

      const state = burgerConstructorSlice.reducer(stateWithBun, removeItem(uid));

      expect(state.bun).not.toBeNull();
    });
  });

  describe('clearConstructor', () => {
    it('очищает конструктор', () => {
      const bun = mockBun();
      const ing = mockIngredient();

      let state = burgerConstructorSlice.reducer(initialState, addItem(bun));
      state = burgerConstructorSlice.reducer(state, addItem(ing));

      state = burgerConstructorSlice.reducer(state, clearConstructor());

      expect(state).toEqual(initialState);
    });
  });
});
