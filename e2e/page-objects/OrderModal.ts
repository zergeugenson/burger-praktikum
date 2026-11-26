import { expect, type Locator, type Page } from '@playwright/test';

export class OrderModal {
  readonly container: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    this.container = page.locator('#modals');
    this.orderNumber = this.container.locator('.text_type_digits-large');
  }

  async expectVisible(): Promise<void> {
    await expect(this.container.getByText('идентификатор заказа')).toBeVisible();
    await expect(this.container.getByText('Ваш заказ начали готовить')).toBeVisible();
  }

  async expectOrderNumber(number: number): Promise<void> {
    await expect(this.orderNumber).toHaveText(String(number));
  }

  async expectHidden(): Promise<void> {
    await expect(this.container.getByText('идентификатор заказа')).toBeHidden();
  }
}