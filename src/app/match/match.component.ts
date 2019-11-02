import { Component } from '@angular/core';
import { MatchService } from './match.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent {

    constructor(private matchService: MatchService, private router: Router) {
        this.matchService.isMatchCompleted$.subscribe(
            isMatchCompleted => {
                if (isMatchCompleted) {
                    this.router.navigateByUrl('/battle');
                }
            }
        );
    }
}
