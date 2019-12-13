import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import * as GameState from '../game.state';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {

    state: GameState.State;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {

    }

    ngOnInit(): void {
        this.state = GameState.getInitialState();
        this.subscribeData();
    }

    ngOnDestroy(): void {
        this.hideError();
    }

    subscribeData() {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.hideError();
                this.state = GameState.reduceWithPlayer(this.state, player);
            },
            error => {
                this.showError();
            }
        );
    }

    private hideError() {
        this.snackBar.dismiss();
    }

    showError() {
        const message = this.translate.instant('game.error');
        this.snackBar.open(message);
    }

}
