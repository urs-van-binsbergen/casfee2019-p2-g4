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
        public matchService: MatchService,
        private cloudFunctions: CloudFunctionsService
    ) {
    }

    async onCancelClicked() {
        this.cloudFunctions.removePreparation({});
    }
}
