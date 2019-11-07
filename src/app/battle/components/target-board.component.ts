import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleBoard } from '../battle-models';
import { Pos } from '@cloud-api/core-models';

@Component({
    selector: 'app-target-board',
    templateUrl: './target-board.component.html',
    styleUrls: ['./target-board.component.scss']
})
export class TargetBoardComponent {
    @Input()
    public targetBoard: BattleBoard;

    @Output()
    shoot = new EventEmitter<Pos>();

    onFieldClick(targetPos: Pos): void {
        this.shoot.emit(targetPos);
    }

}
