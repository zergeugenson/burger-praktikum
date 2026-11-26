import { expect, type Locator, type Page } from '@playwright/test';

import { gotoRoute } from '../mocks';

export class ConstructorPage {
  readonly page: Page;
  readonly dropZone: Locator;
  readonly totalPrice: Locator;
  readonly orderButton: Locator;
  readonly overlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropZone = page.locator('div[class*="burger-constructor__container"]');
    this.totalPrice = page.locator('span.text_type_digits-medium').first();
    this.orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.overlay = page.locator('div[class*="modal-overlay__overlay"]');
  }

  async goto(): Promise<void> {
    await gotoRoute(this.page, '/');
    await expect(this.page.getByText('Соберите бургер')).toBeVisible();
  }

  async waitForIngredient(name: string): Promise<void> {
    await this.ingredientImage(name).waitFor({ state: 'visible' });
  }

  ingredientImage(name: string): Locator {
    return this.page.getByRole('img', { name });
  }

  bunTop(name: string): Locator {
    return this.page.getByText(`${name} (верх)`);
  }

  bunBottom(name: string): Locator {
    return this.page.getByText(`${name} (низ)`);
  }

  ingredientInConstructor(name: string): Locator {
    return this.page
      .locator('section[class*="burger-constructor"]')
      .getByText(name);
  }

  async dragIngredientToConstructor(name: string): Promise<void> {
    const source = this.ingredientImage(name).locator('xpath=ancestor::li[1]');
    await source.waitFor({ state: 'visible' });
    await source.scrollIntoViewIfNeeded();
    await this.dropZone.waitFor({ state: 'visible' });

    const srcBox = await source.boundingBox();
    const dstBox = await this.dropZone.boundingBox();
    if (!srcBox || !dstBox) {
      throw new Error('Нет bounding box у источника или цели');
    }

    const sx = Math.round(srcBox.x + srcBox.width / 2);
    const sy = Math.round(srcBox.y + srcBox.height / 2);
    const dx = Math.round(dstBox.x + dstBox.width / 2);
    const dy = Math.round(dstBox.y + dstBox.height / 2);

    const dispatch = (type: string, x: number, y: number) =>
      this.page.evaluate(
        ({ type, x, y }) => {
          const el = document.elementFromPoint(x, y);
          if (!el) return;
          const dt = new DataTransfer();
          el.dispatchEvent(
            new DragEvent(type, {
              dataTransfer: dt,
              bubbles: true,
              cancelable: true,
              clientX: x,
              clientY: y,
            })
          );
        },
        { type, x, y }
      );

    await dispatch('dragstart', sx, sy);
    await this.page.mouse.move(dx, dy);
    await dispatch('dragenter', dx, dy);
    await dispatch('dragover', dx, dy);
    await dispatch('drop', dx, dy);
    await dispatch('dragend', sx, sy);
  }

  async placeOrder(): Promise<void> {
    await this.orderButton.click();
  }

  async closeWithEsc(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async closeWithOverlayClick(): Promise<void> {
    const box = await this.overlay.boundingBox();
    if (!box) throw new Error('Overlay не найден');
    await this.page.mouse.click(box.x + 5, box.y + 5);
  }
}