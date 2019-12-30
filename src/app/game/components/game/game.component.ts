import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { GameState, GameStateModel } from '../../state/game.state';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { GameStatus, updateStatus } from '../../model/game.model';
import { BindGame, UnbindGame } from '../../state/game.actions';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {

    status: GameStatus = {};
    private _destroy$ = new Subject<void>();

    @Select(GameState.state) _state$: Observable<GameStateModel>;

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(new BindGame());
        this._state$.pipe(
            takeUntil(this._destroy$),
            tap((state: GameStateModel) => {
                this.status = updateStatus(this.status, state.loading, state.unauthenticated, state.player);
            }),
            finalize(() => {
                this.store.dispatch(new UnbindGame());
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
    }

}
