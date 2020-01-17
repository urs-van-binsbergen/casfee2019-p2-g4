import { AppPage } from './app.po';
import { UserPage, login, tabulaRasa } from './user.po';
import { GamePage } from './game.po';
import { HallPage } from './hall.po';
import { browser, logging, ElementFinder } from 'protractor';

describe('Game', () => {
    const email = 'p1schies.hsr+13@gmail.com';
    const password = 'Test13';
    const title = 'Prepare for the battle';
    let appPage: AppPage;
    let userPage: UserPage;
    let gamePage: GamePage;
    let hallPage: HallPage;

    beforeEach(() => {
        appPage = new AppPage();
        userPage = new UserPage();
        gamePage = new GamePage();
        hallPage = new HallPage();
    });

    it('should start', async () => {
        await browser.waitForAngularEnabled(false);
        await tabulaRasa(userPage, hallPage);
        await userPage.navigateTo();
        await login(userPage, email, password);
        const gameButton: ElementFinder = await appPage.getGameButton();
        await gameButton.click();
        const preparationTitle: string = await gamePage.getPreparationTitleText();
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
