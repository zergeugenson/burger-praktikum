import { test, expect, type Page } from '@playwright/test';
import { ingredients, ORDER_NUMBER } from '../fixtures/ingredients';
import { mockBurgerApi, seedAuth, gotoRoute } from '../mocks';

/*
 *  1. Перетаскивание ингредиентов
 *  2. Создание заказа
 *  3. Работа модалок
 */

const bun = ingredients.find((i) => i.type === 'bun')!;
const mains = ingredients.filter((i) => i.type === 'main');
const main1 = mains[0]!;
const main2 = mains[1]!;

const BUN_NAME = bun.name;
const BUN_PRICE = bun.price;
const MAIN_1_NAME = main1.name;
const MAIN_2_NAME = main2.name;

test.beforeEach(async ({ page }) => {
  await seedAuth(page);
  await mockBurgerApi(page);
});

const dropZone = (page: Page) =>
  page.locator('div[class*="burger-constructor__container"]');

const totalPrice = (page: Page) =>
  page.locator('span.text_type_digits-medium').first();

const orderButton = (page: Page) =>
  page.getByRole('button', { name: 'Оформить заказ' });

const orderModal = (page: Page) => page.locator('#modals');

async function dragIngredientToConstructor(page: Page, ingredientName: string) {
  const source = page
    .getByRole('img', { name: ingredientName })
    .locator('xpath=ancestor::li[1]');
  await source.waitFor({ state: 'visible' });
  await source.scrollIntoViewIfNeeded();

  const target = dropZone(page);
  await target.waitFor({ state: 'visible' });

  const srcBox = await source.boundingBox();
  const dstBox = await target.boundingBox();
  if (!srcBox || !dstBox) throw new Error('Нет bounding box у источника или цели');

  const sx = Math.round(srcBox.x + srcBox.width / 2);
  const sy = Math.round(srcBox.y + srcBox.height / 2);
  const dx = Math.round(dstBox.x + dstBox.width / 2);
  const dy = Math.round(dstBox.y + dstBox.height / 2);

  const dispatch = (type: string, x: number, y: number) =>
    page.evaluate(
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
  await page.mouse.move(dx, dy);
  await dispatch('dragenter', dx, dy);
  await dispatch('dragover', dx, dy);
  await dispatch('drop', dx, dy);
  await dispatch('dragend', sx, sy);
}

async function openConstructor(page: Page) {
  await gotoRoute(page, '/');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
  await page.getByRole('img', { name: BUN_NAME }).waitFor({ state: 'visible' });
}

test.describe('Страница открывается?', () => {
  test('Страница открывается.', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
  });
});

test.describe('Конструктор — путь пользователя', () => {
  test('сборка бургера DnD и оформление заказа', async ({ page }) => {
    await openConstructor(page);

    // 1
    await dragIngredientToConstructor(page, BUN_NAME);

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(totalPrice(page)).toHaveText(String(BUN_PRICE));

    await dragIngredientToConstructor(page, MAIN_1_NAME);
    await expect(
      page.locator('section[class*="burger-constructor"]').getByText(MAIN_1_NAME)
    ).toBeVisible();
    await dragIngredientToConstructor(page, MAIN_2_NAME);
    await expect(
      page.locator('section[class*="burger-constructor"]').getByText(MAIN_2_NAME)
    ).toBeVisible();

    // 3.1
    await orderButton(page).click();

    // 2.1.1
    await expect(orderModal(page).getByText('идентификатор заказа')).toBeVisible();
    await expect(orderModal(page).getByText('Ваш заказ начали готовить')).toBeVisible();

    // 3.2
    const orderNumberEl = orderModal(page).locator('.text_type_digits-large');
    await expect(orderNumberEl).toHaveText(String(ORDER_NUMBER));

    // 2.1.2
    await page.keyboard.press('Escape');
    await expect(orderModal(page).getByText('идентификатор заказа')).toBeHidden();
  });
});

test.describe('Модальные окна — детали ингредиента', () => {
  // 2.2
  test('открывается по клику и закрывается по Esc', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('img', { name: BUN_NAME }).click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByRole('heading', { name: BUN_NAME })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal.getByText('Детали ингредиента')).toBeHidden();
  });

  test('закрывается кликом по оверлею', async ({ page }) => {
    await openConstructor(page);

    await page.getByRole('img', { name: MAIN_1_NAME }).click();
    const modal = page.locator('#modals');
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    const overlay = page.locator('div[class*="modal-overlay__overlay"]');
    const box = await overlay.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + 5, box!.y + 5);

    await expect(modal.getByText('Детали ингредиента')).toBeHidden();
  });
});