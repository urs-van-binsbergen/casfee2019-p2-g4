import { browser, by, element, protractor, ElementFinder } from 'protractor';

const EC = protractor.ExpectedConditions;

export class HallPage {
    static async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl + '/hall');
    }

    static async getHall(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .e2e-hall'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Hall');
        return Promise.resolve(ele);
    }

    static async getGameButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root button[routerLink="game"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Game button');
        return Promise.resolve(ele);
    }
}
