import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {

    constructor(private router: Router, private preparationService: PreparationService, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.preparationService.reset();
    }

    get isChanged(): boolean {
        return this.preparationService.isChanged;
    }

    get isContinueDisabled(): boolean {
        return !(this.isValidated);
    }

    get isValidated(): boolean {
        return this.preparationService.isValideted;
    }

    onContinueClicked() {
        this.router.navigateByUrl('/match');
    }

    onChangedClicked() {
        this.preparationService.change();
    }

    onValidatedClicked() {
        this.preparationService.validate();
    }
}
