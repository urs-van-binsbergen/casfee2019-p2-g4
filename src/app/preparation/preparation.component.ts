import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparationService } from './preparation.service';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'preparation',
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {
    title = 'Preparation';

    constructor(private router: Router, private preparationService: PreparationService, public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.preparationService.reset();
    }

    get isChanged(): boolean {
        return this.preparationService.isChanged;
    }

    onGoClicked() {
        this.router.navigateByUrl('/hall');
    }

    onChangeClicked() {
        this.preparationService.change();
    }
}
