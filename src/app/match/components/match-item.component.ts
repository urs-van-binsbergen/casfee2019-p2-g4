import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatchItem } from '../match-item';

@Component({
    selector: 'app-match-item',
    templateUrl: './match-item.component.html',
    styleUrls: ['./match-item.component.scss']
})
export class MatchItemComponent {

    @Input()
    public item: MatchItem;
    @Output()
    public challenge: EventEmitter<boolean> = new EventEmitter<boolean>();

    public onChallengeChange(challenge: boolean) {
        this.challenge.emit(challenge);
    }
}
