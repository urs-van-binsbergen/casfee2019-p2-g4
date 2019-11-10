import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BattleField } from '../battle-models';
import { Pos } from '@cloud-api/core-models';

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
    shoot = new EventEmitter<Pos>();

    public onFieldClick(targetPos: Pos): void {
        if (this.canShoot) {
            this.shoot.emit(targetPos);
        }
    }

}
