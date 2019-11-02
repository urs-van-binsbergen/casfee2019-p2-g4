import { Component } from '@angular/core';
import { MatchItem } from '../match-item';
import { MatchService } from '../match.service';

@Component({
    selector: 'app-match-items',
    templateUrl: './match-items.component.html',
    styleUrls: ['./match-items.component.scss']
})
export class MatchItemsComponent {

    constructor(private matchService: MatchService) {
    }

    public get items(): MatchItem[] {
        return this.matchService.items;
    }

    public onChallengeChange(item: MatchItem, challenge: boolean) {
        this.matchService.challenge(item, challenge);
    }
}
