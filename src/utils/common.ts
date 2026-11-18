import type { TIngredient, TFeedOrder } from '@/utils/api';

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');
export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

export type TFeedOrderWithIngredients = Omit<TFeedOrder, 'ingredients'> & {
  ingredients: TIngredient[];
  price: number;
};

type TAnyOrder = {
  ingredients: string[] | TIngredient[];
  _id: string;
  status: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export const fullOrderWithIngredients = (
  order: TAnyOrder,
  catalog: TIngredient[]
): TFeedOrderWithIngredients | null => {
  const catalogMap = new Map<string, TIngredient>();
  catalog.forEach((ing) => catalogMap.set(ing._id, ing));
  const seenBuns = new Set<string>();

  const ingredients: TIngredient[] = [];
  let price = 0;

  for (const item of order.ingredients) {
    // Нормализуем: если item — строка, ищем в каталоге; если объект — берём как есть
    const ingredient = typeof item === 'string' ? catalogMap.get(item) : item;

    if (!ingredient) return null;

    const id = ingredient._id;
    if (ingredient.type === 'bun') {
      if (seenBuns.has(id)) continue;
      seenBuns.add(id);
    }

    ingredients.push(ingredient);
    price += ingredient.price;
  }

  return {
    ...order,
    ingredients,
    price,
  };
};
