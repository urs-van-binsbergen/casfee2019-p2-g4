import { UserPage } from './user.po';
import { browser, logging } from 'protractor';

const user = 'p1schies.hsr+13@gmail.com';
const password = 'Test13';

describe('User', () => {
    let page: UserPage;

    beforeEach(() => {
        page = new UserPage();
    });

    it('should login', async () => {
        await browser.waitForAngularEnabled(false);
        await page.navigateTo();
        await page.getEmailInput().sendKeys(user);
        await page.getPasswordInput().sendKeys(password);
        await page.getSubmitButton().click();
        await page.getLogoutButton();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
