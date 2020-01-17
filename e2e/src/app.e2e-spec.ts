import { browser, logging, ElementFinder } from 'protractor';
import { AppPage } from './app.po';

describe('App', () => {

    beforeEach(() => {
    });

    it('should display title', async () => {
        const titleEn = 'Battleship P2g4';
        const titleDe = 'Panzerkreuzer P2g4';
        let title: string;
        let englishButton: ElementFinder;
        let germanButton: ElementFinder;

        await browser.waitForAngularEnabled(false);
        await AppPage.navigateTo();

        title = await AppPage.getTitleText();
        expect(title).toBe(titleEn);

        germanButton = await AppPage.getGermanButton();
        await germanButton.click();
        title = await AppPage.getTitleText();
        expect(title).toBe(titleDe);

        englishButton = await AppPage.getEnglishButton();
        await englishButton.click();
        title = await AppPage.getTitleText();
        expect(title).toBe(titleEn);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
