import { Component, OnInit } from '@angular/core';
import { PreparationService } from '../preparation.service';
import { YardService } from '../yard.service';

@Component({
    selector: 'app-preparation-status',
    templateUrl: './preparation-status.component.html',
    styleUrls: ['./preparation-status.component.scss']
})
export class PreparationStatusComponent implements OnInit {

    constructor(private yardService: YardService, private preparationService: PreparationService) {
    }

    ngOnInit(): void {
    }

    get hasErrorKeys(): boolean {
        for (const key of this.yardService.keys) {
            if (!(this.preparationService.isShipOk(key))) {
                return true;
            }
        }
        return false;
    }

    get hasOkKeys(): boolean {
        for (const key of this.yardService.keys) {
            if (this.preparationService.isShipOk(key)) {
                return true;
            }
        }
        return false;
    }

    get errorKeys(): string[] {
        const errorKeys: string[] = [];
        for (const key of this.yardService.keys) {
            if (!(this.preparationService.isShipOk(key))) {
                errorKeys.push(key);
            }
        }
        return errorKeys;
    }

    get okKeys(): string[] {
        const okKeys: string[] = [];
        for (const key of this.yardService.keys) {
            if (this.preparationService.isShipOk(key)) {
                okKeys.push(key);
            }
        }
        return okKeys;
    }

}
