import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchItem } from '../../model/match-models';

@Component({
    selector: 'app-match-item',
    templateUrl: './match-item.component.html',
    styleUrls: ['./match-item.component.scss']
})
export class MatchItemComponent {

    @Input()
    public item: MatchItem;
    @Output()
    public changeChallenge: EventEmitter<boolean> = new EventEmitter<boolean>();

    isChangingChallenge = false;

    public onChallengeClick() {
        this.isChangingChallenge = true;
        this.changeChallenge.emit(true);
    }

    public onUnchallengeClick() {
        this.isChangingChallenge = true;
        this.changeChallenge.emit(false);
    }

}
