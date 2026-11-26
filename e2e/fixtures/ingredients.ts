export type TIngredientType = 'bun' | 'sauce' | 'main';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TUser = {
  email: string;
  name: string;
};

export const ingredients: TIngredient[] = [
  {
    _id: '692889f16bf770001bfeb4cc',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4cd',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4d2',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4d3',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4d6',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4d7',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 55,
    calories: 77,
    price: 874,
    image: 'https://code.s3.yandex.net/react/code/sp_1.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
    __v: 0,
  },
  {
    _id: '692889f16bf770001bfeb4d8',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    __v: 0,
  },
];

export const mockUser: TUser = {
  email: 'e2e@test.com',
  name: 'E2E Tester',
};

export const ORDER_NUMBER = 12345;