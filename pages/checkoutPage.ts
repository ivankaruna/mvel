import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputZip: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputFirstName = page.locator('#first-name');
    this.inputLastName = page.locator('#last-name');
    this.inputZip = page.locator('#postal-code');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillFirstName(name: string) {
    await this.inputFirstName.fill(name);
  }

  async fillLastName(name: string) {
    await this.inputLastName.fill(name);
  }

  async fillZip(name: string) {
    await this.inputZip.fill(name);
  }

  async fillForm(firstName: string, lastName: string, zip: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillZip(zip);
    await this.continueButton.click();
  }

  async goToCart() {
    await this.cancelButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }
}
