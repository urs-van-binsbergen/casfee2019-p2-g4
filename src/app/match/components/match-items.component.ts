import { Component, Input } from '@angular/core';
import { MatchItem } from '../match-item';

@Component({
    selector: 'app-match-items',
    templateUrl: './match-items.component.html',
    styleUrls: ['./match-items.component.scss']
})
export class MatchItemsComponent {

    @Input()
    public items: MatchItem[];

    public onChallengeChange(challenge: boolean, item: MatchItem) {
        item.challenge(challenge);
    }
}
