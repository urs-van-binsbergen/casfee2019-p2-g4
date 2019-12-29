import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleBoard, BattleField } from '../../model/battle-models';

@Component({
    selector: 'app-target-board',
    templateUrl: './target-board.component.html',
    styleUrls: ['./target-board.component.scss']
})
export class TargetBoardComponent {
    @Input()
    public targetBoard: BattleBoard;

    @Output()
    shoot = new EventEmitter<BattleField>();

    @Output()
    uncovered = new EventEmitter<BattleField>();

    get canShoot(): boolean {
        return this.targetBoard.canShoot && !(this.targetBoard.isShooting);
    }

    onShoot(field: BattleField): void {
        this.shoot.emit(field);
    }

    onUncovered(field: BattleField): void {
        this.uncovered.emit(field);
    }

}
