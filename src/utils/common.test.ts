import { describe, expect, it } from 'vitest';
import type { TIngredient } from '@/utils/api';
import { fullOrderWithIngredients } from './common';

describe('fullOrderWithIngredients', () => {
  const makeIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
    _id: 'id',
    name: 'Ингредиент',
    type: 'main' as TIngredient['type'],
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: '',
    __v: 0,
    ...overrides,
  });

  const bun = makeIngredient({
    _id: 'bun1',
    type: 'bun' as TIngredient['type'],
    price: 50,
  });
  const bun2 = makeIngredient({
    _id: 'bun2',
    type: 'bun' as TIngredient['type'],
    price: 70,
  });
  const main = makeIngredient({ _id: 'main1', price: 200 });
  const sauce = makeIngredient({
    _id: 'sauce1',
    type: 'sauce' as TIngredient['type'],
    price: 30,
  });
  const catalog = [bun, bun2, main, sauce];

  const makeOrder = (ingredients: string[] | TIngredient[]) => ({
    ingredients,
    _id: 'order1',
    status: 'done',
    number: 42,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  it('заменяет id на ингредиенты из каталога и считает цену', () => {
    const result = fullOrderWithIngredients(
      makeOrder(['bun1', 'main1', 'sauce1']),
      catalog
    );

    expect(result?.ingredients).toEqual([bun, main, sauce]);
    expect(result?.price).toBe(50 + 200 + 30);
  });

  it('возвращает null, если ингредиента нет в каталоге', () => {
    expect(
      fullOrderWithIngredients(makeOrder(['main1', 'unknown']), catalog)
    ).toBeNull();
  });

  it('пустой заказ даёт пустой список и нулевую цену', () => {
    const result = fullOrderWithIngredients(makeOrder([]), catalog);

    expect(result?.ingredients).toEqual([]);
    expect(result?.price).toBe(0);
  });

  it('пустой каталог и id в заказе дают null', () => {
    expect(fullOrderWithIngredients(makeOrder(['main1']), [])).toBeNull();
  });

  describe('не булки', () => {
    it('повторяющиеся начинки и соусы сохраняются', () => {
      const result = fullOrderWithIngredients(
        makeOrder(['main1', 'main1', 'sauce1', 'sauce1']),
        catalog
      );

      expect(result?.ingredients).toHaveLength(4);
      expect(result?.price).toBe(200 + 200 + 30 + 30);
    });
  });

  it('сохраняет порядок ингредиентов из заказа', () => {
    const result = fullOrderWithIngredients(
      makeOrder(['sauce1', 'bun1', 'main1']),
      catalog
    );

    expect(result?.ingredients.map((i) => i._id)).toEqual(['sauce1', 'bun1', 'main1']);
  });
});
