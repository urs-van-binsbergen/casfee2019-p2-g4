import { UserPage } from './user.po';
import { browser, logging } from 'protractor';

async function login(page: UserPage, email: string, password: string) {
    await page.getEmailInput().sendKeys(email);
    await page.getPasswordInput().sendKeys(password);
    await page.getSubmitButton().click();
    await page.getLogoutButton();
}

async function logout(page: UserPage) {
    await page.getLogoutButton().click();
    await page.getEmailInput();
    await page.getPasswordInput();
    await page.getSubmitButton();
}

describe('User', () => {
    const email = 'p1schies.hsr+13@gmail.com';
    const password = 'Test13';
    let page: UserPage;

    beforeEach(() => {
        page = new UserPage();
    });

    it('should login', async () => {
        await login(page, email, password);
    });

    it('should logout', async () => {
        await login(page, email, password);
        await logout(page);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
