import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatchItem } from './match-item';
import { MatchService } from './match.service';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent {

    constructor(private router: Router, private matchService: MatchService) { }

    onMatchClicked() {
        this.router.navigateByUrl('/battle');
    }

    get items(): MatchItem[] {
        return this.matchService.items;
    }
}
