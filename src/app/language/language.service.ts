import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cache } from '../shared/cache';

@Injectable()
export class LanguageService {

    private _languages: string[];
    private _language: string;
    private _cache: Cache<string>;

    constructor(private translate: TranslateService) {
        this._cache = new Cache('LanguageService:Language');
        this._languages = ['en', 'de'];
        this.translate.addLangs(this._languages);
        this.translate.setDefaultLang('en');
        if (this._cache.hasCache()) {
            this.language = this._cache.readCache();
        } else {
            this.language = 'en';
        }
    }

    set language(language: string) {
        if (this._languages.includes(language)) {
            this._language = language;
            this.translate.use(language);
            this._cache.writeCache(language);
        }
    }

    get languages(): string[] {
        return this._languages;
    }

    isUsed(language: string) {
        return this._language === language;
    }
}
