import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
    templateUrl: './mini-game.component.html',
})
export class MiniGameComponent implements OnInit {
    title = 'Mini Game';

    constructor(private router: Router, public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

}
