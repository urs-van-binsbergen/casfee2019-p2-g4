import { Component, Input } from '@angular/core';
import { PreparationRow, PreparationShip } from '../../model/preparation-models';
const size = 0.1;

@Component({
    selector: 'app-preparation-board',
    templateUrl: './preparation-board.component.html',
    styleUrls: ['./preparation-board.component.scss']
})
export class PreparationBoardComponent {
    @Input()
    rows: PreparationRow[] = null;
    @Input()
    ships: PreparationShip[] = null;

    public centerTop(ship: PreparationShip): string {
        if (ship.isVertical) {
            return ((ship.length * ship.centerVertical / 100 - size) / ship.length * 100) + '%';
        } else {
            return ((ship.centerVertical / 100 - size) * 100) + '%';
        }
    }

    public centerLeft(ship: PreparationShip): string {
        if (ship.isVertical) {
            return ((ship.centerHorizontal / 100 - size) * 100) + '%';
        } else {
            return ((ship.length * ship.centerHorizontal / 100 - size) / ship.length * 100) + '%';
        }
    }

    public centerWidth(ship: PreparationShip): string {
        if (ship.isVertical) {
            return (2 * size * 100) + '%';
        } else {
            return (2 * size / ship.length * 100) + '%';
        }
    }

    public centerHeight(ship: PreparationShip): string {
        if (ship.isVertical) {
            return (2 * size / ship.length * 100) + '%';
        } else {
            return (2 * size * 100) + '%';
        }
    }
}
