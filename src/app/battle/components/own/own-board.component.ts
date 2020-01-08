import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BattleBoard, BattleField } from '../../model/battle-models';

@Component({
    selector: 'app-own-board',
    templateUrl: './own-board.component.html',
    styleUrls: ['./own-board.component.scss']
})
export class OwnBoardComponent {
    @Input()
    public ownBoard: BattleBoard;

    @Output()
    uncovered = new EventEmitter<BattleField>();

    onUncovered(field: BattleField): void {
        this.uncovered.emit(field);
    }
}
