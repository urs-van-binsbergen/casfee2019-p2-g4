import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './hall.component.html',
    styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    onBattleClicked() {
        this.router.navigateByUrl('/preparation');
    }
}
