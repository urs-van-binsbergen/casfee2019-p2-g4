import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { MatDialog } from '@angular/material';

import { YardService } from './yard.service';
import { DragService } from '../drag/drag.service';
import { DropDelegate } from '../drag/drop.delegate';
import { Ship } from '../shared/ship';

import { AngularFireFunctions } from '@angular/fire/functions';
import { PreparationArgs } from '@cloud-api/preparation';
import { Ship as CloudShip } from '@cloud-api/core-models';

@Component({
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit, DropDelegate {

    private possibleX: number;
    private possibleY: number;

    waiting = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private preparationService: PreparationService,
        private yardService: YardService,
        private dragService: DragService,
        private fns: AngularFireFunctions,
    ) {
    }

    ngOnInit(): void {
        this.preparationService.reset();
        this.dragService.dropDelegate = this;
    }

    get isChanged(): boolean {
        return this.preparationService.isChanged;
    }

    get isContinueDisabled(): boolean {
        return !(this.isValidated);
    }

    get isValidated(): boolean {
        return this.preparationService.isValidated;
    }

    onContinueClicked() {

        this.waiting = true;

        // TODO: move the following stuff to some Service

        var ships = this.preparationService.ships;
        var cloudShips = Array.from<CloudShip>(ships.map(s => {
            let cloudShip: CloudShip = {
                pos: { x: s.x, y: s.y },  // TODO: get the top/left-beginning of the ship
                length: 2, // TODO: geht the length of the ship
                isVertical: s.rotation % 180 === 0,
                isSunk: false
            };
            return cloudShip;
        }));

        const args: PreparationArgs = {
            miniGameNumber: null,
            ships: cloudShips
        };

        const callable = this.fns.httpsCallable('addPreparation');
        callable(args).toPromise()
            .then(x => {
                this.waiting = false;
                this.router.navigateByUrl('/match');
            })
            .catch(err => {
                this.waiting = false;
            })
            ;
    }

    onChangedClicked() {
        this.preparationService.change();
    }

    onValidatedClicked() {
        this.preparationService.validate();
    }

    get yardKeys(): string[] {
        const ships = this.yardService.ships;
        const keys: string[] = [];
        ships.forEach((ship) => {
            keys.push(ship.key);
        });
        return keys;
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
        if (this.possibleX === x && this.possibleY === y) {
            return 'possibleTarget';
        }
        return '';
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

    // DropDelegate
    canDropDraggable(key: string, x: number, y: number): boolean {
        return this.preparationService.canAddShip(key, x, y);
    }

    enterDropTarget(x: number, y: number): void {
        this.possibleX = x;
        this.possibleY = y;
    }

    leaveDropTarget(x: number, y: number): void {
        if (this.possibleX === x && this.possibleY === y) {
            this.possibleX = -1;
            this.possibleY = -1;
        }
    }

    dropDraggable(key: string, x: number, y: number): boolean {
        if (this.preparationService.canAddShip(key, x, y)) {
            let ship: Ship = this.yardService.removeShip(key);
            if (ship === null) {
                ship = this.preparationService.removeShip(key);
            }
            if (ship !== null) {
                this.preparationService.addShip(ship, x, y);
                return true;
            }
        }
        return false;
    }
}
