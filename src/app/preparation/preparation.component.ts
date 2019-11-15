import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { YardService } from './yard.service';
import { MatDialog } from '@angular/material';

import { PreparationArgs } from '@cloud-api/arguments';
import { Ship as CloudShip, Orientation } from '@cloud-api/core-models';
import { CloudFunctionsService } from '../backend/cloud-functions.service';

import { Ship as UiShip } from '../shared/ship';

@Component({
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {

    waiting = false;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private yardService: YardService,
        private preparationService: PreparationService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {
        this.yardService.reset();
        this.preparationService.reset();
    }

    get enableDeactivationWarning(): boolean {
        return !this.waiting && this.preparationService.isChanged;
    }

    get isContinueDisabled(): boolean {
        return !(this.preparationService.isValid);
    }

    onContinueClicked() {
        this.waiting = true;

        const args = this.createPreparationArgs(this.preparationService.ships);

        this.cloudFunctions.addPreparation(args).subscribe(
            results => {
                console.log(results);
                this.router.navigateByUrl('/match');
            },
            error => {
                console.log(error);
                this.waiting = false;
            },
            () => {
                console.log('completed');
            }
        );
    }

    getOrientation(rotation: number): Orientation {
        // TODO: move this method to some appropriate place
        switch (rotation) {
            case 0:
                return Orientation.South;
            case 90:
                return Orientation.West;
            case 180:
                return Orientation.North;
            case 270:
                return Orientation.East;
            default:
                throw new Error(`Can not map rotation ${rotation} to an orientation`);
        }
    }

    getLength(s: UiShip): number {
        const w = Math.max(...s.fields.map(f => f.x)) - Math.min(...s.fields.map(f => f.x));
        const h = Math.max(...s.fields.map(f => f.y)) - Math.min(...s.fields.map(f => f.y));
        const length = Math.max(w, h);
        return length;
    }

    createPreparationArgs(uiShips: UiShip[]): PreparationArgs {
        // TODO: move this method to some appropriate place
        const cloudShips = uiShips.map(s => {
            const orientation = this.getOrientation(s.rotation);
            const length = this.getLength(s);
            const cloudShip: CloudShip = {
                pos: { x: s.x, y: s.y },
                length,
                orientation,
                design: 0, // TODO: map appearance/color
                isSunk: false,
                hits: [],
            };

            return cloudShip;
        });

        return {
            size: { w: 8, h: 8 }, // TODO: move magic number to some constant
            ships: [...cloudShips]
        };

    }

}
