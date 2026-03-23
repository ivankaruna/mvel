import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Тесты авторизации', () => {
  let loginPage: LoginPage;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Успешная авторизация', async () => {
    await loginPage.login(`${username}`, `${password}`);
    await expect(loginPage.page).toHaveURL(/inventory/);
  });

  test('Неудачная авторизация с пустыми полями', async () => {
    await loginPage.loginClick();
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username is required');
  });

  test('Неудачная авторизация с невалидным логином', async () => {
    await loginPage.login(`${username}`, 'asd');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('Неудачная авторизация с невалидным паролем', async () => {
    await loginPage.login('asd', `${password}`);
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });
});
