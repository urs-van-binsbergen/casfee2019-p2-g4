import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleField } from '../battle-models';
import { Pos, FieldStatus } from '@cloud-api/core-models';

@Component({
    selector: 'app-target-field',
    templateUrl: './target-field.component.html',
    styleUrls: ['./target-field.component.scss']
})
export class TargetFieldComponent {

    @Input()
    public field: BattleField;

    @Input()
    public canShoot: boolean;

    @Output()
    shoot = new EventEmitter<BattleField>();

    @Output()
    uncovered = new EventEmitter<BattleField>();

    public onFieldClick(field: BattleField): void {
        if (this.canShoot) {
            this.shoot.emit(field);
        }
    }

    public onAnimationend(field: BattleField): void {
        if (this.isUncovering) {
            this.uncovered.emit(field);
        }
    }

    get isCovered(): boolean {
        return !(this.field.shooting) && this.field.status === FieldStatus.Unknown;
    }

    get isShooting(): boolean {
        return this.field.shooting && this.field.status === FieldStatus.Unknown;
    }

    get isUncovering(): boolean {
        return this.field.shooting && this.field.status !== FieldStatus.Unknown;
    }

    get isUncovered(): boolean {
        return !(this.field.shooting) && this.field.status !== FieldStatus.Unknown;
    }

}
