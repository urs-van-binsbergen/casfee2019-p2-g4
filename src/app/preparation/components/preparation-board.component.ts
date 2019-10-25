import { Component, OnInit } from '@angular/core';
import { PreparationService } from '../preparation.service';
import { DragService } from '../drag/drag.service';

@Component({
    selector: 'app-preparation-board',
    templateUrl: './preparation-board.component.html',
    styleUrls: ['./preparation-board.component.scss']
})
export class PreparationBoardComponent implements OnInit {

    constructor(
        private preparationService: PreparationService,
        private dragService: DragService
    ) {
    }

    ngOnInit(): void {
        this.preparationService.reset();
    }

    get xIndexes(): number[] {
        const max: number = this.preparationService.width;
        const xIndexes: number[] = [];
        for (let x = 0; x < max; x++) {
            xIndexes.push(x);
        }
        return xIndexes;
    }

    get yIndexes(): number[] {
        const max: number = this.preparationService.height;
        const yIndexes: number[] = [];
        for (let y = 0; y < max; y++) {
            yIndexes.push(y);
        }
        return yIndexes;
    }

    possibleTarget(x: number, y: number): string {
        if (this.dragService.x === x && this.dragService.y === y) {
            return 'possibleTarget';
        }
        return '';
    }

    fieldClass(x: number, y: number): string {
        if (this.preparationService.hasClash(x, y)) {
            return 'clashField';
        }
        return 'field';
    }

    fieldKeys(x: number, y: number): string[] {
        const ship = this.preparationService.getShipAt(x, y);
        if (ship === null) {
            return [];
        }
        return [ship.key];
    }

    rotation(x: number, y: number): number {
        const ship = this.preparationService.getShipAt(x, y);
        if (ship === null) {
            return 0;
        }
        return ship.rotation;
    }

    onClick(x: number, y: number) {
        const ship = this.preparationService.getShipAt(x, y);
        if (ship === null) {
            return;
        }
        ship.rotate();
    }

}
