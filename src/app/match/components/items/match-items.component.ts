import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchItem } from '../../model/match-models';

@Component({
    selector: 'app-match-items',
    templateUrl: './match-items.component.html'
})
export class MatchItemsComponent {

    @Input()
    public items: MatchItem[];
    @Output()
    public addChallenge: EventEmitter<MatchItem> = new EventEmitter<MatchItem>();
    @Output()
    public removeChallenge: EventEmitter<MatchItem> = new EventEmitter<MatchItem>();

    public onChallengeChange(item: MatchItem, challenge: boolean) {
        if (challenge) {
            this.addChallenge.emit(item);
        } else {
            this.removeChallenge.emit(item);
        }
    }
}
