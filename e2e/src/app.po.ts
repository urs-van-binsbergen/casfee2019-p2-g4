import { browser, by, element, protractor, ElementFinder } from 'protractor';

const EC = protractor.ExpectedConditions;

export class AppPage {
    async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl);
    }

    async getTitleText(): Promise<string> {
        const ele: ElementFinder = element(by.css('app-root .title'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Title text');
        return Promise.resolve(ele.getText());
    }

    async getEnglishButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .segmented-control-label[for="EN"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'English button');
        return Promise.resolve(ele);
    }

    async getGermanButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .segmented-control-label[for="DE"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'German button');
        return Promise.resolve(ele);
    }

    async getGameButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .nav-row1-buttons button[routerLink="game"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Game button');
        return Promise.resolve(ele);
    }
}
