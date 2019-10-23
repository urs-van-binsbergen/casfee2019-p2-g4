import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { YardService } from './yard.service';
import { MatDialog } from '@angular/material';

import { PreparationArgs } from '@cloud-api/preparation';
import { Ship as CloudShip } from '@cloud-api/core-models';
import { CloudFunctionsService } from '../backend/cloud-functions.service';

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

        const ships = this.preparationService.ships;
        const cloudShips = Array.from<CloudShip>(ships.map(s => {
            const cloudShip: CloudShip = {
                pos: { x: s.x, y: s.y },
                length: 2,
                isVertical: s.rotation % 180 === 0,
                isSunk: false
            };

            // TODO: This is a just a working draft, details are to be harmonized

            return cloudShip;
        }));

        const args: PreparationArgs = {
            miniGameNumber: null,
            ships: cloudShips
        };

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

}
