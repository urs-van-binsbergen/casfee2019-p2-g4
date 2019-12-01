import { Component, Input } from '@angular/core';
import { PreparationRow, PreparationShip } from '../preparation-models';
const size = 10;

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
            return (ship.centerVertical - size / 2 / ship.length) + '%';
        } else {
            return (ship.centerVertical - size / 2) + '%';
        }
    }

    public centerLeft(ship: PreparationShip): string {
        if (ship.isVertical) {
            return (ship.centerHorizontal - size / 2) + '%';
        } else {
            return (ship.centerHorizontal - size / 2 / ship.length) + '%';
        }
    }

    public centerWidth(ship: PreparationShip): string {
        if (ship.isVertical) {
            return size + '%';
        } else {
            return (size / ship.length) + '%';
        }
    }

    public centerHeight(ship: PreparationShip): string {
        if (ship.isVertical) {
            return (size / ship.length) + '%';
        } else {
            return size + '%';
        }
    }
}
