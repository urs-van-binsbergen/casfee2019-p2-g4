import { browser, by, element, protractor, ElementFinder } from 'protractor';
import { HallPage } from './hall.po';

const EC = protractor.ExpectedConditions;

export class UserPage {
    static async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl + '/user');
    }

    static async getEmailInput(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root input[type="email"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return Promise.resolve(ele);
    }

    static async getPasswordInput(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root input[type="password"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return Promise.resolve(ele);
    }

    static async getSubmitButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root button[type="submit"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Submit button');
        return Promise.resolve(ele);
    }

    static async getLogoutButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .logout-button'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Logout button');
        return Promise.resolve(ele);
    }
}

export async function tabulaRasa(): Promise<void> {
    await UserPage.navigateTo();
    const ele: ElementFinder = element(by.css('app-root .logout-button'));
    const visible: boolean = await browser.wait(EC.visibilityOf(ele), 1000, 'Tabula rasa')
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return Promise.resolve(false);
        });
    if (visible) {
        await logout();
    }
    await HallPage.navigateTo();
    await HallPage.getHall();
    return Promise.resolve();
}

export async function login(email: string, password: string): Promise<void> {
    const emailInput: ElementFinder = await UserPage.getEmailInput();
    await emailInput.sendKeys(email);
    const passwordInput: ElementFinder = await UserPage.getPasswordInput();
    await passwordInput.sendKeys(password);
    const submitButton: ElementFinder = await UserPage.getSubmitButton();
    await submitButton.click();
    await UserPage.getLogoutButton();
    return Promise.resolve();
}

export async function logout(): Promise<void> {
    const logoutButton: ElementFinder = await UserPage.getLogoutButton();
    await logoutButton.click();
    await HallPage.getHall();
    return Promise.resolve();
}
