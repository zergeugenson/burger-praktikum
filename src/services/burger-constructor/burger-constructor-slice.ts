import {
  createSlice,
  createSelector,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { createOrder } from '@services/order/order-actions';
import type { RootState } from '@services/store';
import type { TIngredient } from '@/utils/api';

const generateUid = (): string => crypto.randomUUID();

export type TConstructorIngredient = TIngredient & { uid: string };
export type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    clearConstructor: () => initialState,

    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const itemWithUid = action.payload;
        if (itemWithUid.type === 'bun') {
          state.bun = itemWithUid;
        } else {
          state.ingredients.push(itemWithUid);
        }
      },
      prepare: (item: TIngredient): { payload: TConstructorIngredient } => ({
        payload: { ...item, uid: generateUid() },
      }),
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const uidToRemove = action.payload;
      if (state.bun && state.bun.uid === uidToRemove) return;

      state.ingredients = state.ingredients.filter(
          (item) => item.uid !== uidToRemove
      );
    },

    moveIngredient: (
        state,
        action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const newIngredients = [...state.ingredients];
      const dragItem = newIngredients[dragIndex];

      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);

      state.ingredients = newIngredients;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, () => initialState);
  },
});

const selectSelf = (state: RootState): TBurgerConstructorState =>
    state.burgerConstructor;

export const selectOrder = createSelector(
    selectSelf,
    (state): TBurgerConstructorState => state
);

export const selectCounts = createSelector(selectSelf, (order) => {
  const newCounts: Record<string, number> = {};
  if (order.bun) {
    newCounts[order.bun._id] = 1;
  }
  order.ingredients.forEach((item) => {
    newCounts[item._id] = (newCounts[item._id] || 0) + 1;
  });
  return newCounts;
});

export const selectTotalPrice = createSelector(selectSelf, (order) => {
  let total = 0;
  if (order.bun) {
    total += order.bun.price;
  }
  // не позволю удваивать стоимость булки для трудящихся, но код написал:
  // order.ingredients.forEach((item) => {
  //   total += item.type === 'bun' ? item.price * 2 : item.price;
  // });
  return total;
});

export const { addItem, removeItem, moveIngredient, clearConstructor } =
    burgerConstructorSlice.actions;
