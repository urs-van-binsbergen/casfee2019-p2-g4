import { browser, by, element, protractor, ElementFinder } from 'protractor';

const EC = protractor.ExpectedConditions;

export class AppPage {
    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getTitleText(): Promise<string> {
        const ele = element(by.css('app-root .title'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Title text');
        return ele.getText() as Promise<string>;
    }

    getEnglishButton(): ElementFinder {
        const ele = element(by.css('app-root .segmented-control-label[for="EN"]'));
        browser.wait(EC.visibilityOf(ele), 10000, 'English button');
        return ele;
    }

    getGermanButton(): ElementFinder {
        const ele = element(by.css('app-root .segmented-control-label[for="DE"]'));
        browser.wait(EC.visibilityOf(ele), 10000, 'German button');
        return ele;
    }
}
