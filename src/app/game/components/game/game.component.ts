import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { GameState, GameStateModel } from '../../state/game.state';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { GameStatus, updateStatus } from '../../model/game.model';
import { BindGame, UnbindGame } from '../../state/game.actions';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {

    status: GameStatus = {};
    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
    ) {
    }

    ngOnInit(): void {
        this.store.dispatch(new BindGame());
        this.store.select(GameState.state)
            .pipe(
                takeUntil(this.destroy$),
                tap((state: GameStateModel) => {
                    this.status = updateStatus(this.status, state.loading, state.unauthenticated, state.player);
                }),
                finalize(() => {
                    this.store.dispatch(new UnbindGame());
                })
            )
            .subscribe()
            ;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
