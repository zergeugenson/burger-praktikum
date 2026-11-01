export const BASE_API_URL = 'https://new-stellarburgers.education-services.ru/api';
export const MODALS_ROOT = 'modals' as const;

export const ingredientsGroups = [
  { label: 'Булки', type: 'bun' },
  { label: 'Начинки', type: 'main' },
  { label: 'Соусы', type: 'sauce' },
] as const;

export type TIngredientType = (typeof ingredientsGroups)[number]['type'];

export const ROUTES = {
  HOME: '/',
  INGREDIENT: '/ingredients/:id',
  LOGIN: '/login',
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ORDERS: '/orders',
} as const;
