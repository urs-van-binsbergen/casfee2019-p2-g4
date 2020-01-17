import { browser, ElementFinder, element, by, protractor } from 'protractor';

const EC = protractor.ExpectedConditions;

export class GamePage {
    static async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl + '/game');
    }

    static async getPreparationTitleText(): Promise<string> {
        const ele: ElementFinder = element(by.css('app-root h2'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Preparation title text');
        return Promise.resolve(ele.getText());
    }
}
