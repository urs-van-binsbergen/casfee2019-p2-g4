import { Component, Input } from '@angular/core';
import { BattleBoard } from '../battle-models';

@Component({
    selector: 'app-own-board',
    templateUrl: './own-board.component.html',
    styleUrls: ['./own-board.component.scss']
})
export class OwnBoardComponent {
    @Input()
    public ownBoard: BattleBoard;
}
