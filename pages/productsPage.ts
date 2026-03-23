import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCart: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCart = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async navigate() {
    await this.page.goto('/inventory.html');
  }

  async getProductByName(name: string) {
    return this.productCart.filter({ hasText: name });
  }

  async addProductToCart(name: string) {
    const product = await this.getProductByName(name);
    await product.getByText('Add to cart').click();
  }

  async removeForomCart(name: string) {
    const product = await this.getProductByName(name);
    await product.getByText('Remove').click();
  }

  async getCartCount() {
    return parseInt((await this.cartLink.textContent()) || '0');
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
