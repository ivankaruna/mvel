import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';

test.describe('Тесты корзины', () => {
  let cartPage: CartPage;
  let productPage: ProductsPage;
  const product1 = 'Sauce Labs Backpack';
  const product2 = 'Sauce Labs Bike Light';

  test.beforeEach('Авторизация и добавление двух товаров', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

    productPage = new ProductsPage(page);
    await productPage.addProductToCart(product1);
    await productPage.addProductToCart(product2);
    await productPage.goToCart();

    cartPage = new CartPage(page);
    await expect(cartPage.page).toHaveURL(/cart/);
  });

  test('Отображение добавленных товаров', async () => {
    await expect(cartPage.productCart).toHaveCount(2);
  });

  test('Удаление товара из корзины', async () => {
    await cartPage.removeProductFromCart(product1);
    await expect(cartPage.productCart).toHaveCount(1);
  });

  test('Переход к списку товаров', async () => {
    await cartPage.continueShopping();
    await expect(cartPage.page).toHaveURL(/inventory/);
  });

  test('Переход на страницу подтверждения', async () => {
    await cartPage.goToCheckout();
    await expect(cartPage.page).toHaveURL(/checkout/);
  });
});
