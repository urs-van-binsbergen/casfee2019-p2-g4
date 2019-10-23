import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { YardService } from './yard.service';
import { MatDialog } from '@angular/material';

import { AngularFireFunctions } from '@angular/fire/functions';
import { PreparationArgs } from '@cloud-api/preparation';
import { Ship as CloudShip } from '@cloud-api/core-models';

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
        private fns: AngularFireFunctions,
    ) {
    }

    ngOnInit(): void {
        this.yardService.reset();
        this.preparationService.reset();
    }

    get isChanged(): boolean {
        return this.preparationService.isChanged;
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

}
