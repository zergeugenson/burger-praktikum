import { test as base, expect } from '@playwright/test';

import { ConstructorPage } from '../page-objects/ConstructorPage';
import { OrderModal } from '../page-objects/OrderModal';
import { IngredientDetailsModal } from '../page-objects/IngredientDetailsModal';

type PageObjectFixtures = {
  constructorPage: ConstructorPage;
  orderModal: OrderModal;
  ingredientDetailsModal: IngredientDetailsModal;
};

export const test = base.extend<PageObjectFixtures>({
  constructorPage: async ({ page }, use) => {
    await use(new ConstructorPage(page));
  },
  orderModal: async ({ page }, use) => {
    await use(new OrderModal(page));
  },
  ingredientDetailsModal: async ({ page }, use) => {
    await use(new IngredientDetailsModal(page));
  },
});

export { expect };