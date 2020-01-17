import { browser, logging } from 'protractor';
import { UserPage, login, logout, tabulaRasa } from './user.po';

describe('User', () => {
    const email = 'p1schies.hsr+13@gmail.com';
    const password = 'Test13';

    beforeEach(() => {
    });

    it('should login', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa();
        await UserPage.navigateTo();
        await login(email, password);
    });

    it('should logout', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa();
        await UserPage.navigateTo();
        await login(email, password);
        await logout();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
