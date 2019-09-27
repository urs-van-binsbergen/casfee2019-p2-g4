import { Component, OnInit } from '@angular/core';
import { LanguageService } from './language.service';

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
    constructor(private languageService: LanguageService) {
    }

    ngOnInit() {
    }

    get languages(): string[] {
        const languages = this.languageService.languages;
        const l = languages.map((language: string) => {
            return language.toUpperCase();
        });
        return l;
    }

    set language(language: string) {
        const l = language.toLowerCase();
        this.languageService.language = l;
    }

    isUsed(language: string) {
        const l = language.toLowerCase();
        return this.languageService.isUsed(l);
    }
}
