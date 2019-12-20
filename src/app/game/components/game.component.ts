import { Component, OnInit, OnDestroy } from '@angular/core';
import * as GameState from '../game.state';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Store, Select } from '@ngxs/store';
import { GetPlayer } from '../state/player.actions';
import { PlayerState } from '../state/player.state';
import { Observable, Subscription } from 'rxjs';
import { Player } from '@cloud-api/core-models';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {

    private _playerSubscription: Subscription;
    @Select(PlayerState.player) player$: Observable<Player>;
    state: GameState.State;

    constructor(
        private store: Store,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {

    }

    ngOnInit(): void {
        this.state = GameState.getInitialState();
        this._playerSubscription = this.player$.subscribe(player => {
                if (player) {
                    this.hideError();
                } else {
                    this.showError();
                }
                this.state = GameState.updateWithPlayer(this.state, player);
            }
        );
        this.store.dispatch(new GetPlayer());
    }

    ngOnDestroy(): void {
        this._playerSubscription.unsubscribe();
    }

    private hideError() {
        this.snackBar.dismiss();
    }

    private showError() {
        const message = this.translate.instant('game.error');
        this.snackBar.open(message);
    }

}
