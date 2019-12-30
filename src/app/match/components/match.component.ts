import { Component, OnInit, OnDestroy } from '@angular/core';
import * as MatchMethods from '../model/match-methods';
import { MatchItem, MatchStatus } from '../model/match-models';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';
import { MatchState, MatchStateModel } from '../state/match.state';
import { AddChallenge, BindMatch, CancelMatch, RemoveChallenge, UnbindMatch } from '../state/match.actions';
import deepClone from 'clone-deep';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html'
})
export class MatchComponent implements OnInit, OnDestroy {

    private _items: MatchItem[] = [];
    private _state: MatchStatus = MatchStatus.Idle;
    private _waiting: boolean;
    private _destroy$ = new Subject<void>();

    @Select(MatchState.loading) loading$: Observable<boolean>;
    @Select(MatchState.state) state$: Observable<MatchStateModel>;

    constructor(
        private store: Store,
        private router: Router) {
    }

    ngOnInit(): void {
        this.store.dispatch(new BindMatch());
        this.state$.pipe(
            takeUntil(this._destroy$),
            tap((state: MatchStateModel) => {
                this._state = MatchMethods.updateMatchStatusWithWaitingPlayers(this._state, state.waitingPlayers, state.uid);
                this._items = MatchMethods.updateMatchItemsWithWaitingPlayers(this._items, state.waitingPlayers, state.uid);
            }),
            finalize(() => {
                this.store.dispatch(new UnbindMatch());
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
    }

    public get items(): MatchItem[] {
        return this._items;
    }

    public get hasItems(): boolean {
        return this._items && 0 < this._items.length;
    }

    get isWaiting(): boolean {
        return this._waiting;
    }

    public onAddChallenge(item: MatchItem) {
        this.store.dispatch(new AddChallenge(item.opponentUid)).toPromise()
            .catch(error => {
                this._items = deepClone(this._items);
            });
    }

    public onRemoveChallenge(item: MatchItem) {
        this.store.dispatch(new RemoveChallenge(item.opponentUid)).toPromise()
            .catch(error => {
                this._items = deepClone(this._items);
            });
    }

    public onCancelClicked() {
        this._waiting = true;
        this.store.dispatch(new CancelMatch()).toPromise()
            .then(results => {
                this.router.navigateByUrl('/hall');
            })
            .finally(() => {
                this._waiting = false;
            });
    }

}
