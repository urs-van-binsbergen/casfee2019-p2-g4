import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display title', async () => {
        const titleEn = 'Battleship P2g4';
        const titleDe = 'Panzerkreuzer P2g4';
        await browser.waitForAngularEnabled(false);
        await page.navigateTo();
        await expect(page.getTitleText()).toEqual(titleEn);
        await page.getGermanButton().click();
        await expect(page.getTitleText()).toEqual(titleDe);
        await page.getEnglishButton().click();
        await expect(page.getTitleText()).toEqual(titleEn);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
