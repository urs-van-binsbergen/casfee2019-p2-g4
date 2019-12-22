import { Component, OnInit } from '@angular/core';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { Player } from '@cloud-api/core-models';
import { Select } from '@ngxs/store';
import { PlayerState } from 'src/app/state/player/player.state';
import { Observable } from 'rxjs';


@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

    constructor(
        private cloudFunctions: CloudFunctionsService

    ) {
    }

    waiting = false;
    @Select(PlayerState.player) player$: Observable<Player>;

    ngOnInit(): void {

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
