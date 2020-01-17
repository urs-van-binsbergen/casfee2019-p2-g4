import { browser, logging, ElementFinder } from 'protractor';
import { AppPage } from './app.po';
import { GamePage } from './game.po';
import { UserPage, login, tabulaRasa } from './user.po';

describe('Game', () => {
    const email = 'p1schies.hsr+13@gmail.com';
    const password = 'Test13';
    const title = 'Prepare for the battle';

    beforeEach(() => {
    });

    it('should start', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa();
        await UserPage.navigateTo();
        await login(email, password);
        const gameButton: ElementFinder = await AppPage.getGameButton();
        await gameButton.click();
        const preparationTitle: string = await GamePage.getPreparationTitleText();
        expect(preparationTitle).toBe(title);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
