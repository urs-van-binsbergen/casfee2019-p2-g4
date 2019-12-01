import { Component, Input } from '@angular/core';
import { PreparationShip } from '../preparation-models';

@Component({
    selector: 'app-preparation-yard',
    templateUrl: './preparation-yard.component.html',
    styleUrls: ['./preparation-yard.component.scss']
})
export class PreparationYardComponent {
    @Input()
    public ships: PreparationShip[];
}
