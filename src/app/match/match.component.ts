import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent {

    constructor(private router: Router) { }

    onMatchClicked() {
        this.router.navigateByUrl('/battle');
    }
}
