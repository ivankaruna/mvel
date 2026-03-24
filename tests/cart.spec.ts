import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';

test.describe('Тесты корзины', () => {
  let cartPage;
  test.beforeEach('Авторизация и добавление двух товаров', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    const productPage = new ProductsPage(page);
    await productPage.addProductToCart('Sauce Labs Backpack');
    await productPage.addProductToCart('Sauce Labs Bike Light');
    await productPage.goToCart();
    cartPage = new CartPage(page);
    await expect(cartPage.page).toHaveURL(/cart/);
  });
  test('', async () => {});
});
