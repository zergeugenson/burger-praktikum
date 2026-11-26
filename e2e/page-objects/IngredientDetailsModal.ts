import { expect, type Locator, type Page } from '@playwright/test';

export class IngredientDetailsModal {
  readonly container: Locator;

  constructor(page: Page) {
    this.container = page.locator('#modals');
  }

  async expectVisible(ingredientName: string): Promise<void> {
    await expect(
      this.container.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(this.container.getByText('Калории, ккал')).toBeVisible();
    await expect(this.container.getByText('Белки, г')).toBeVisible();
    await expect(
      this.container.getByRole('heading', { name: ingredientName })
    ).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.container.getByText('Детали ингредиента')).toBeHidden();
  }
}