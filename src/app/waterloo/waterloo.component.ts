import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './waterloo.component.html',
    styleUrls: ['./waterloo.component.scss']
})
export class WaterlooComponent {

    constructor(private router: Router) {
    }

    onBattleClicked() {
        this.router.navigateByUrl('/hall');
    }
}
