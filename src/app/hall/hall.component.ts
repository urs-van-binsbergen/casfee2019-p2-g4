import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'hall',
    templateUrl: './hall.component.html',
    styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {
    title = 'Hall of Fame';

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    onGoClicked() {
        this.router.navigateByUrl('/preparation');
    }
}
