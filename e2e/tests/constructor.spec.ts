import { test, expect } from '../fixtures/fixtures';
import { ingredients, ORDER_NUMBER } from '../fixtures/ingredients';
import { mockBurgerApi, seedAuth } from '../mocks';

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

test.describe('Страница открывается?', () => {
  test('Страница открывается.', async ({ constructorPage }) => {
    await constructorPage.goto();
  });
});

test.describe('Конструктор — путь пользователя', () => {
  test('сборка бургера DnD и оформление заказа', async ({
    constructorPage,
    orderModal,
  }) => {
    await constructorPage.goto();

    // 1
    await constructorPage.dragIngredientToConstructor(BUN_NAME);
    await expect(constructorPage.bunTop(BUN_NAME)).toBeVisible();
    await expect(constructorPage.bunBottom(BUN_NAME)).toBeVisible();
    await expect(constructorPage.totalPrice).toHaveText(String(BUN_PRICE));

    await constructorPage.dragIngredientToConstructor(MAIN_1_NAME);
    await expect(constructorPage.ingredientInConstructor(MAIN_1_NAME)).toBeVisible();

    await constructorPage.dragIngredientToConstructor(MAIN_2_NAME);
    await expect(constructorPage.ingredientInConstructor(MAIN_2_NAME)).toBeVisible();

    // 3
    await constructorPage.placeOrder();

    // 2.1.1
    await orderModal.expectVisible();
    await orderModal.expectOrderNumber(ORDER_NUMBER);

    // 2.1.2
    await constructorPage.closeWithEsc();
    await orderModal.expectHidden();
  });
});

test.describe('Модальные окна — детали ингредиента', () => {
  // 2.2
  test('открывается по клику и закрывается по Esc', async ({
    constructorPage,
    ingredientDetailsModal,
  }) => {
    await constructorPage.goto();

    await constructorPage.ingredientImage(BUN_NAME).click();
    await ingredientDetailsModal.expectVisible(BUN_NAME);

    await constructorPage.closeWithEsc();
    await ingredientDetailsModal.expectHidden();
  });

  test('закрывается кликом по оверлею', async ({
    constructorPage,
    ingredientDetailsModal,
  }) => {
    await constructorPage.goto();

    await constructorPage.ingredientImage(MAIN_1_NAME).click();
    await ingredientDetailsModal.expectVisible(MAIN_1_NAME);

    await constructorPage.closeWithOverlayClick();
    await ingredientDetailsModal.expectHidden();
  });
});