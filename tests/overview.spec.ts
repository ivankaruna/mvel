import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { OverviewPage } from '../pages/overviewPage';

test.describe('', () => {
  let productPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let overviewPage: OverviewPage;

  const product1 = 'Sauce Labs Backpack';
  const product2 = 'Sauce Labs Bike Light';
  const firstName = 'a';
  const lastName = 's';
  const zip = 'd';

  test.beforeEach('Авторизация и добавление товаров в корзину', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

    productPage = new ProductsPage(page);
    await productPage.addProductToCart(product1);
    await productPage.addProductToCart(product2);
    await productPage.goToCart();

    cartPage = new CartPage(page);
    await expect(cartPage.page).toHaveURL(/cart/);
    await cartPage.goToCheckout();

    checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.page).toHaveURL(/checkout-step-one/);
    await checkoutPage.fillForm(firstName, lastName, zip);

    overviewPage = new OverviewPage(page);
    await expect(overviewPage.page).toHaveURL(/checkout-step-two/);
  });

  test('Отображение добавленных товаров', async () => {
    expect(await overviewPage.getProductsCount()).toEqual(2);
  });

  test('Проверка подсчета стоимости товаров', async () => {
    const price1 = await overviewPage.getProductPrice(product1);
    const price2 = await overviewPage.getProductPrice(product2);

    expect(price1 + price2).toEqual(await overviewPage.getPrice());
  });

  test('Переход на страницу товаров', async () => {
    await overviewPage.goToProductPage();
    await expect(overviewPage.page).toHaveURL(/inventory/);
  });

  test('Оформление заказа', async () => {
    await overviewPage.goToFinish();
    await expect(overviewPage.page).toHaveURL(/checkout-complete/);
  });

  test('Возврат на страницу товаров после оформления заказа', async () => {
    await overviewPage.backHome();
    await expect(overviewPage.page).toHaveURL(/inventory/);
  });
});
