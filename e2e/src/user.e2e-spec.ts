import { UserPage, login, logout, tabulaRasa } from './user.po';
import { HallPage } from './hall.po';
import { browser, logging } from 'protractor';

describe('User', () => {
    const email = 'p1schies.hsr+13@gmail.com';
    const password = 'Test13';
    let userPage: UserPage;
    let hallPage: HallPage;

    beforeEach(() => {
        userPage = new UserPage();
        hallPage = new HallPage();
    });

    it('should login', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa(userPage, hallPage);
        await userPage.navigateTo();
        await login(userPage, email, password);
    });

    it('should logout', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa(userPage, hallPage);
        await userPage.navigateTo();
        await login(userPage, email, password);
        await logout(userPage, hallPage);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
