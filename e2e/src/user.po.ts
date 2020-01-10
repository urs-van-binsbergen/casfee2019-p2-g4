import { browser, by, element, protractor, ElementFinder } from 'protractor';

const EC = protractor.ExpectedConditions;

export class UserPage {
    navigateTo() {
        return browser.get(browser.baseUrl + '/user') as Promise<any>;
    }

    getEmailInput(): ElementFinder {
        const ele = element(by.css('app-root input[type="email"]'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return ele;
    }

    getPasswordInput(): ElementFinder {
        const ele = element(by.css('app-root input[type="password"]'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return ele;
    }

    getSubmitButton(): ElementFinder {
        const ele = element(by.css('app-root button[type="submit"]'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Submit button');
        return ele;
    }

    getLogoutButton(): ElementFinder {
        const ele = element(by.css('app-root .logout-button'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Logout button');
        return ele;
    }

    getHall(): ElementFinder {
        const ele = element(by.css('app-root .hall'));
        browser.wait(EC.visibilityOf(ele), 10000, 'Hall');
        return ele;
    }

}
