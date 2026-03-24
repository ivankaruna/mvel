import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartTotal: Locator;
  readonly productCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
    this.cartTotal = page.locator('[data-test="shopping-cart-link"]');
    this.productCart = page.locator('[data-test="inventory-item"]');
  }

  async navigate() {
    await this.page.goto('/cart.html');
  }

  async getProductsCount() {
    return await this.productCart.count();
  }

  async getProductByName(name: string) {
    return this.productCart.filter({ hasText: name });
  }

  async removeProductFromCart(name: string) {
    const product = await this.getProductByName(name);
    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async isProductinCart(name: string) {
    const product = await this.getProductByName(name);
    return await product.isVisible();
  }
}
