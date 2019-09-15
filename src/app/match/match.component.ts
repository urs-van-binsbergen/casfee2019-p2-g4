import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
    title = 'Match Module';

    constructor(private router: Router) { }

    ngOnInit() {
    }

    onGoClicked() {
        this.router.navigateByUrl('/battle');
    }
}
