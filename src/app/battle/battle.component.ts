import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

    title = 'Battle';

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onGoClicked() {
        this.router.navigateByUrl('/hall');
    }

}
