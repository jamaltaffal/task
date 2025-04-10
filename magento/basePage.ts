import { Page } from '@playwright/test';
import { expect } from '@playwright/test';


export class devPage {
  readonly page: Page;
  readonly productsSection: string;
  readonly signInClick: string;
  readonly usernameField: string;
  readonly passwordField: string;
  readonly signInButton: string;
  readonly searchField: string;
  readonly searchButton: string;
  readonly productSearchSection: string;
  readonly productNamesLocator: string;
  readonly addToCartButton: string;
  readonly cartProductNamesLocator: string;
  readonly emptyCartButton: string;
  readonly emptyCartMessageLocator: string;
  readonly goToCartButton: string;
  readonly proceedToCheckoutButton: string;
  readonly emailField: string;
  readonly firstNameField: string;
  readonly lastNameField: string;
  readonly addressField: string;
  readonly cityField: string;
  readonly zipCodeField: string;
  readonly countryField: string;
  readonly phoneNumberField: string;
  readonly nextButton: string;
  readonly cartSummary: string;
  readonly placeOrderButton: string;
  readonly orderId: string;



  constructor(page: Page) {
    this.page = page;
    this.productsSection = '[class^="product-items"]';
    this.signInClick = '.action + .header [class^="authorization-link"] a';
    this.usernameField = '[class^="control"] [name^="login[username]"]';
    this.passwordField = '[class^="control"] [name^="login[password]"]';
    this.signInButton = '[class^="action login primary"]';
    this.searchField = '[class^="field search"] [class^="control"] input';
    this.searchButton = '[class^="actions"] button:first-child';
    this.productSearchSection = '[class^="products list items product-items"]';
    this.productNamesLocator = '[class^="item product product-item"] [class^="product-item-info"]';
    this.addToCartButton = '[class^="actions"] button[title^="Add to Cart"]';
    this.cartProductNamesLocator = '[class^="product-item-details"] [class^="product-item-name"]';
    this.emptyCartButton = '[class^="actions-toolbar"] [title^="Remove item"]';
    this.emptyCartMessageLocator = '[class="cart-empty"] p:first-child';
    this.goToCartButton = '[data-bind="html: $parent.prepareMessageForHtml(message.text)"] a';
    this.proceedToCheckoutButton = ' [class="item"] [type="button"]';
    this.emailField = '[class="control _with-tooltip"] [class="input-text"][type="email"]';
    this.firstNameField = '[class="input-text"][name="firstname"]';
    this.lastNameField = '[class="input-text"][name="lastname"]';
    this.addressField = '[class="input-text"][name^="street[0]"]';
    this.cityField = '[class="input-text"][name="city"]';
    this.zipCodeField = '[class="input-text"][name="postcode"]';
    this.countryField = '[class="select"][name="country_id"]';
    this.phoneNumberField = '[class="control _with-tooltip"] [class="input-text"][type="text"]';
    this.nextButton = '[class="primary"] button[class="button action continue primary"]';
    this.cartSummary = '[class="cart-summary"]';
    this.placeOrderButton = '[class="primary"] [class="action primary checkout"]';
    this.orderId = '[data-th="Order #"][class="col id"]';
  }

  async navigateToPage(urlName: string) {
    await this.page.goto(urlName);
  }

  async verifyProductsVisible() {
    await this.page.waitForSelector(this.productsSection);
  }
  async login(username: string, password: string) {
    await this.page.click(this.signInClick);
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.signInButton);
  }

  async searchForProduct(productName: string) {
    await this.page.fill(this.searchField, productName);
    await this.page.click(this.searchButton);
  }
  async verifyProductSearchResults() {
    await this.page.waitForSelector(this.productSearchSection);
  }

  async getProductNames() {
    const productNames = await this.page.locator(this.productNamesLocator).allTextContents();
    return productNames;
  }

  async verifySearchUrl(productName: string) {
    const expectedUrl = `https://magento.softwaretestingboard.com/catalogsearch/result/?q=${encodeURIComponent(productName)}`;
    const currentUrl = this.page.url();
    if (currentUrl !== expectedUrl) {
      throw new Error(`URL mismatch: expected "${expectedUrl}", but got "${currentUrl}"`);
    }
  }

  async clickFirstResult(productName: string) {
    const firstProductLocator = this.page.locator('ol[class="products list items product-items"] > li:nth-child(1)');
    await firstProductLocator.click();
  }

  async addToCart() {
    await this.page.click(this.addToCartButton)
  }

  async verifyProductInCart(productName: string) {
    await this.page.waitForSelector(this.cartProductNamesLocator);
    const cartProductNames = await this.page.locator(this.cartProductNamesLocator).allTextContents();
    const productInCart = cartProductNames.some((name) => name.toLowerCase().includes(productName.toLowerCase()));
  }

  async emptyCart() {
    await this.page.click(this.emptyCartButton);
    const actualText = await this.page.textContent(this.emptyCartMessageLocator);
    const expectedText = 'You have no items in your shopping cart.';
    expect(actualText?.trim()).toBe(expectedText);
  }

  async goToCart() {
    await this.page.click(this.goToCartButton)
  }

  async waitToLoad() {
    await this.page.waitForSelector(this.cartSummary);

  }

  async proceedToCheckout() {
    await this.page.click(this.proceedToCheckoutButton);
  }

  async checkoutInfo(email: string, firstName: string, lastName: string, address: string, city: string, zipCode: string, country: string, phoneNumber: string) {
    await this.page.fill(this.emailField, email);
    await this.page.fill(this.firstNameField, firstName);
    await this.page.fill(this.lastNameField, lastName);
    await this.page.fill(this.addressField, address);
    await this.page.fill(this.cityField, city);
    await this.page.fill(this.zipCodeField, zipCode);
    await this.page.fill(this.countryField, country);
    await this.page.fill(this.phoneNumberField, phoneNumber);
  }

  async nextCheckout() {
    await this.page.click(this.nextButton)
  }

  async placeOrder() {
    await this.page.click(this.placeOrderButton)
  }

  async checkOrderId() {
    await this.page.waitForSelector(this.orderId)
  }

  async waitThePageToLoad(){    
    await this.page.waitForLoadState('domcontentloaded');
  }

}
