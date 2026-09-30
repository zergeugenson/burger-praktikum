import { createSlice, createSelector } from '@reduxjs/toolkit';

const generateUid = () => crypto.randomUUID();

const initialState = {
	bun: null,
	ingredients: [],
};

export const burgerConstructorSlice = createSlice({
	name: 'burgerConstructor',
	initialState,
	reducers: {
		clearConstructor: (state) => initialState,
		addItem: {
			reducer: (state, action) => {
				const itemWithUid = action.payload;
				if (itemWithUid.type === 'bun') {
					state.bun = itemWithUid;
				} else {
					state.ingredients.push(itemWithUid);
				}
			},
			prepare: (item) => {
				return { payload: { ...item, uid: generateUid() } };
			},
		},

		removeItem: (state, action) => {
			const uidToRemove = action.payload;
			if (state.bun && state.bun.uid === uidToRemove) return;

			state.ingredients = state.ingredients.filter(
				(item) => item.uid !== uidToRemove
			);
		},

		moveIngredient: (state, action) => {
			const { dragIndex, hoverIndex } = action.payload;
			const newIngredients = [...state.ingredients];
			const dragItem = newIngredients[dragIndex];

			newIngredients.splice(dragIndex, 1);
			newIngredients.splice(hoverIndex, 0, dragItem);

			state.ingredients = newIngredients;
		},
	},
});

const selectSelf = (state) => state.burgerConstructor;

export const selectOrder = createSelector(selectSelf, (state) => state);

export const selectCounts = createSelector(selectSelf, (order) => {
	const newCounts = {};
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
	order.ingredients.forEach((item) => {
		total += item.type === 'bun' ? item.price * 2 : item.price;
	});
	return total;
});

export const { addItem, removeItem, moveIngredient, clearConstructor } = burgerConstructorSlice.actions;
