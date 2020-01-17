import { browser } from 'protractor';

export class GamePage {
    async navigateTo(): Promise<any> {
        return browser.get(browser.baseUrl + '/game');
    }
}
