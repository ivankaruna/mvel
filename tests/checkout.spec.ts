import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage';
import { LoginPage } from '../pages/loginPage';
import { ProductsPage } from '../pages/productsPage';
import { CheckoutPage } from '../pages/checkoutPage';

test.describe('Тест страницы проверки', () => {
  let productPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  const product1 = 'Sauce Labs Backpack';
  const product2 = 'Sauce Labs Bike Light';
  const firstName = 'a';
  const lastName = 's';
  const zip = 'd';

  test.beforeEach('', async ({ page }) => {
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
  });

  test('Заполнение формы и переход на второй шаг', async () => {
    await checkoutPage.fillForm(firstName, lastName, zip);
    await expect(checkoutPage.page).toHaveURL(/checkout-step-two/);
  });

  test('Заполнение формы пустыми полями', async () => {
    await checkoutPage.fillForm('', '', '');
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    expect(await checkoutPage.getErrorMessage()).toContain('Error: First Name is required');
  });

  test('Заполнение всех полей кроме first anme', async () => {
    await checkoutPage.fillForm('', lastName, zip);
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    expect(await checkoutPage.getErrorMessage()).toContain('Error: First Name is required');
  });

  test('Заполнение всех полей кроме last name', async () => {
    await checkoutPage.fillForm(firstName, '', zip);
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    expect(await checkoutPage.getErrorMessage()).toContain('Error: Last Name is required');
  });

  test('Заполнение всех полей кроме Zip', async () => {
    await checkoutPage.fillForm(firstName, lastName, '');
    expect(await checkoutPage.isErrorMessageVisible()).toBeTruthy();
    expect(await checkoutPage.getErrorMessage()).toContain('Error: Postal Code is required');
  });
});
