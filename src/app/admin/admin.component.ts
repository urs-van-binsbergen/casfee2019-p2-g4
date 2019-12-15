import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';


@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private cloudData: CloudDataService,
        private authState: AuthStateService
    ) {
    }

    waiting = false;
    hasPlayerData = false;

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => this.hasPlayerData = !!player,
            error => this.hasPlayerData = false
        );
    }

    purge() {
        this.waiting = true;

        const args = {};
        this.cloudFunctions.deleteGameData(args).toPromise()
            .then(results => {
                this.waiting = false;
            })
            .catch(error => {
                this.waiting = false;
            })
            ;
    }

}
