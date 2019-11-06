import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleBoard } from '../battle-models';
import { Pos } from '@cloud-api/core-models';

@Component({
    selector: 'target-board',
    templateUrl: './target-board.component.html',
    styleUrls: [ './target-board.component.scss' ]
})
export class TargetBoardComponent {
    @Input() 
    public targetBoard: BattleBoard;

    @Output()
    onShoot = new EventEmitter<Pos>();

    onFieldClick(targetPos: Pos): void {
        this.onShoot.emit(targetPos);
    }

}