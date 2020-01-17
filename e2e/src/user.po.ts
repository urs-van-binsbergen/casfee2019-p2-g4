import { browser, by, element, protractor, ElementFinder } from 'protractor';
import { HallPage } from './hall.po';

const EC = protractor.ExpectedConditions;

export async function tabulaRasa(userPage: UserPage, hallPage: HallPage): Promise<void> {
    await userPage.navigateTo();
    const ele: ElementFinder = element(by.css('app-root .logout-button'));
    const visible: boolean = await browser.wait(EC.visibilityOf(ele), 1000, 'Tabula rasa')
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return Promise.resolve(false);
        });
    if (visible) {
        await logout(userPage, hallPage);
    }
    await hallPage.navigateTo();
    await hallPage.getHall();
    return Promise.resolve();
}

export async function login(userPage: UserPage, email: string, password: string): Promise<void> {
    const emailInput: ElementFinder = await userPage.getEmailInput();
    await emailInput.sendKeys(email);
    const passwordInput: ElementFinder = await userPage.getPasswordInput();
    await passwordInput.sendKeys(password);
    const submitButton: ElementFinder = await userPage.getSubmitButton();
    await submitButton.click();
    await userPage.getLogoutButton();
    return Promise.resolve();
}

export async function logout(userPage: UserPage, hallPage: HallPage): Promise<void> {
    const logoutButton: ElementFinder = await userPage.getLogoutButton();
    await logoutButton.click();
    await hallPage.getHall();
    return Promise.resolve();
}

export class UserPage {
    async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl + '/user');
    }

    async getEmailInput(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root input[type="email"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return Promise.resolve(ele);
    }

    async getPasswordInput(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root input[type="password"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Input email');
        return Promise.resolve(ele);
    }

    async getSubmitButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root button[type="submit"]'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Submit button');
        return Promise.resolve(ele);
    }

    async getLogoutButton(): Promise<ElementFinder> {
        const ele: ElementFinder = element(by.css('app-root .logout-button'));
        await browser.wait(EC.visibilityOf(ele), 10000, 'Logout button');
        return Promise.resolve(ele);
    }
}
