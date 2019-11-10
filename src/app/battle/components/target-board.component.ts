import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleBoard, BattleField } from '../battle-models';
import * as battleMethods from '../battle-methods';

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
        return this.targetBoard.canShoot && !(battleMethods.isShooting(this.targetBoard));
    }

    onShoot(field: BattleField): void {
        this.shoot.emit(field);
    }

    onUncovered(field: BattleField): void {
        this.uncovered.emit(field);
    }

}
