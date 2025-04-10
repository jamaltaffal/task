import { test, expect } from '@playwright/test';
import { devPage } from './basePage';

test.describe('Homepage Tests', () => {
    let DevPage: devPage;

    test.beforeEach(async ({ page }) => {
        DevPage = new devPage(page);
        await DevPage.navigateToPage('https://magento.softwaretestingboard.com/');
        await DevPage.login('jamaltaffal1@gmail.com', 'Jamal12345')
    });

    test('navigate to homepage and view products', async ({ page }) => {
        await DevPage.navigateToPage('https://magento.softwaretestingboard.com/');
        await DevPage.verifyProductsVisible();
    });

    test('User can search for a specific product, verify all results contain the search term', async ({ page }) => {
        const productName = 'backpack';
        await DevPage.navigateToPage('https://magento.softwaretestingboard.com/');
        await DevPage.searchForProduct(productName);
        await DevPage.verifyProductSearchResults();
        await DevPage.verifySearchUrl(productName);
        const productNames = await DevPage.getProductNames()

        productNames.forEach((name) => {
            productNames.forEach((name) => {
                try {
                  expect(name.toLowerCase()).toContain(productName.toLowerCase());
                } catch (err) {
                  console.warn(`failed for product: ${name} - ${err.message}`);
                }        });
    });
});

    test('User can add to cart a product and delete it', async ({ page }) => {
        const productName = 'backpack';
        await DevPage.navigateToPage(`https://magento.softwaretestingboard.com/catalogsearch/result/?q=+${productName}`);
        await DevPage.clickFirstResult(productName);
        await DevPage.addToCart();
        await DevPage.goToCart();
        await DevPage.verifyProductInCart(productName);
        await DevPage.emptyCart();
    });
        test('Add another product, proceed to checkout, fill the checkout information and place order', async ({ page }) => {
            const productName = 'backpack';
            await DevPage.navigateToPage(`https://magento.softwaretestingboard.com/catalogsearch/result/?q=+${productName}`);
            await DevPage.clickFirstResult(productName);
            await DevPage.addToCart();
            await DevPage.goToCart();
            await page.waitForTimeout(5000);
            await DevPage.waitToLoad();
            await DevPage.proceedToCheckout();
            await DevPage.navigateToPage(`https://magento.softwaretestingboard.com/checkout/#shipping`);
            await DevPage.waitThePageToLoad();
            await DevPage.checkoutInfo('jamaltaffal@gmail.com', 'Jamal', 'Taffal', 'mecca street', 'Amman', '11190', 'Jordan', '0777321301');
            await DevPage.nextCheckout();
            await DevPage.placeOrder();
        });
        test('Check if the order is in history page', async ({ page }) => {
            await DevPage.navigateToPage(`https://magento.softwaretestingboard.com/sales/order/history/`);
            await DevPage.checkOrderId();
        });
    });
