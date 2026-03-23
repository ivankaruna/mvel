import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { describe } from 'node:test';

describe('Тесты продуктов', () => {
  let productPage: ProductsPage;
  const product = 'Sauce Labs Backpack';

  test.beforeEach('Авторизация', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    productPage = new ProductsPage(page);
    await expect(productPage.page).toHaveURL(/inventory/);
  });
  test('Отображение карточек товаров', async () => {
    await expect(productPage.productCart).toHaveCount(6);
  });

  test('Добавление товара в корзину', async () => {
    const initialCount = await productPage.getCartCount();
    await productPage.addProductToCart(product);
    await expect(productPage.cartLink).toHaveText((initialCount + 1).toString());
  });

  test('Удаление товара из корзины', async () => {
    const initialCount = await productPage.getCartCount();
    await productPage.addProductToCart(product);
    await expect(productPage.cartLink).toHaveText((initialCount + 1).toString());
    await productPage.removeForomCart(product);
    expect(await productPage.getCartCount()).toEqual(initialCount);
  });

  test('Переход в корзину', async () => {
    await productPage.addProductToCart(product);
    await productPage.goToCart();
    await expect(productPage.page).toHaveURL(/cart/);
  });
});
