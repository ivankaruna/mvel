import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputZip: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputFirstName = page.locator('');
    this.inputLastName = page.locator('');
    this.inputZip = page.locator('');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }
}
