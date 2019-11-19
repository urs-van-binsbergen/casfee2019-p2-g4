import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss']
})
export class VictoryComponent {

    constructor(private router: Router) {
    }

    onBattleClicked() {
        this.router.navigateByUrl('/hall');
    }
}
