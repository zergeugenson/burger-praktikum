import type { Page } from '@playwright/test';
import { ingredients, mockUser, ORDER_NUMBER } from '../fixtures/ingredients';

export const mockBurgerApi = async (page: Page): Promise<void> => {
  const cors = {
    'access-control-allow-origin': '*',
  } as const;

  // CORS-preflight
  await page.route('**/api/**', async (route): Promise<void> => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'access-control-allow-headers': 'authorization, content-type',
          'access-control-max-age': '0',
        },
      });
      return;
    }
    await route.fallback();
  });

  await page.route('**/api/ingredients', async (route): Promise<void> => {
    await route.fulfill({
      json: { data: ingredients, success: true },
      headers: cors,
    });
  });

  await page.route('**/api/auth/user', async (route): Promise<void> => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        json: { success: true, user: mockUser },
        headers: cors,
      });
      return;
    }

    if (method === 'PATCH') {
      const body = (route.request().postDataJSON() ?? {}) as {
        email?: string;
        name?: string;
      };

      await route.fulfill({
        json: {
          success: true,
          user: {
            email: body.email ?? mockUser.email,
            name: body.name ?? mockUser.name,
          },
        },
        headers: cors,
      });
      return;
    }

    await route.continue();
  });

  await page.route('**/api/orders', async (route): Promise<void> => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      json: {
        name: 'Краторный spicy бургер',
        order: { number: ORDER_NUMBER },
        success: true,
      },
      headers: cors,
    });
  });
};

export const seedAuth = async (page: Page): Promise<void> => {
  await page.addInitScript((): void => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

export const gotoRoute = async (page: Page, pathname: string): Promise<void> => {
  await page.goto(pathname);
};