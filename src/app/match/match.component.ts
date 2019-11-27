import { Component } from '@angular/core';
import { MatchService } from './match.service';
import { Router } from '@angular/router';
import { CloudFunctionsService } from '../backend/cloud-functions.service';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent {

    constructor(
        private matchService: MatchService,
        private router: Router,
        private cloudFunctions: CloudFunctionsService
    ) {
        this.matchService.isMatchCompleted$.subscribe(
            isMatchCompleted => {
                if (isMatchCompleted) {
                    this.router.navigateByUrl('/battle');
                }
            }
        );
    }

    async onCancelClicked() {
        await this.router.navigateByUrl('/preparation');
        this.cloudFunctions.removePreparation({});
    }
}
