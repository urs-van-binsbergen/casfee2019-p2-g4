import { Component, OnInit } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import * as GameState from '../game.state';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {

    state: GameState.State;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService
    ) {

    }

    ngOnInit(): void {
        this.state = GameState.getInitialState();
        this.subscribeData();
    }


    subscribeData() {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.state = GameState.reduceWithPlayer(this.state, player);
            },
            error => {
                // TODO error handling
                console.error(error);
            }
        );
    }

}
