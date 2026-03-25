import { Locator, Page } from '@playwright/test';

export class OverviewPage {
  readonly page: Page;
  readonly productCart: Locator;
  readonly itemTotal: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCart = page.locator('[data-test="inventory-item"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async navigate() {
    await this.page.goto('/checkout-step-two.html');
  }

  async getProductsCount() {
    return await this.productCart.count();
  }

  async getProductByName(name: string) {
    return this.productCart.filter({ hasText: name });
  }

  async getProductPrice(name: string) {
    const product = await this.getProductByName(name);
    const price = await product.locator('[data-test="inventory-item-price"]').textContent();
    return parseFloat(price?.replace('$', '') || '0');
  }

  async getPrice() {
    const itemTotal = await this.itemTotal.textContent();
    return parseFloat(itemTotal?.replace('Item total: $', '') || '0');
  }

  async goToProductPage() {
    await this.cancelButton.click();
  }

  async goToFinish() {
    await this.finishButton.click();
  }

  async backHome() {
    await this.goToFinish();
    await this.backHomeButton.click();
  }
}
