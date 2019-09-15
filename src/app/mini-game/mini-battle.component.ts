import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './mini-battle.component.html',
})
export class MiniBattleComponent implements OnInit {
    title = 'Battle';

    constructor(private router: Router, public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

}
