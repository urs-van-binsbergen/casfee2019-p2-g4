import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleField } from '../battle-models';
import { FieldStatus } from '@cloud-api/core-models';

@Component({
    selector: 'app-battle-field',
    templateUrl: './battle-field.component.html',
    styleUrls: ['./battle-field.component.scss']
})
export class BattleFieldComponent {

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
