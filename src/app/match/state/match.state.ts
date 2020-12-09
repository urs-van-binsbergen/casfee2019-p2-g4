import { Action, State, Selector, StateContext, Store } from '@ngxs/store';
import { Subject, throwError, of } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddChallenge, BindMatch, CancelMatch, RemoveChallenge, UnbindMatch, UpdateMatch } from './match.actions';
import { WaitingPlayer } from '@cloud-api/core-models';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Injectable } from '@angular/core';

export interface MatchStateModel {
    loading: boolean;
    uid: string;
    waitingPlayers: WaitingPlayer[] | null;
}

@State<MatchStateModel>({
    name: 'match',
    defaults: {
        loading: false,
        uid: null,
        waitingPlayers: null
    }
})

@Injectable({ providedIn: 'root' })
export class MatchState {

    private _unbind$: Subject<void>;
    private _observers: number;

    constructor(
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private store: Store,
        private notification: NotificationService
    ) {
        this._unbind$ = null;
        this._observers = 0;
    }

    @Selector()
    public static loading(state: MatchStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static state(state: MatchStateModel): MatchStateModel {
        return state;
    }

    @Action(AddChallenge)
    addChallenge(ctx: StateContext<MatchStateModel>, action: AddChallenge) {
        return this.cloudFunctions.addChallenge({ opponentUid: action.opponentUid }).pipe(
            catchError((error) => {
                const errorMsg = action.isStartingBattle ? 'match.error.start' : 'match.error.add';
                this.notification.quickErrorToast(errorMsg);
                return throwError(error);
            })
        );
    }

    @Action(RemoveChallenge)
    removeChallenge(ctx: StateContext<MatchStateModel>, action: RemoveChallenge) {
        return this.cloudFunctions.removeChallenge({ opponentUid: action.opponentUid }).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('match.error.remove');
                return throwError(error);
            })
        );
    }

    @Action(CancelMatch)
    cancelMatch(ctx: StateContext<MatchStateModel>) {
        return this.cloudFunctions.removePreparation({}).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('match.error.cancel');
                return throwError(error);
            })
        );
    }

    @Action(UpdateMatch)
    UpdateWaitingPlayers(ctx: StateContext<MatchStateModel>, action: UpdateMatch) {
        const uid = this.store.selectSnapshot(AuthState.authUid);
        ctx.patchState({ loading: false, uid, waitingPlayers: action.waitingPlayers });
    }

    @Action(BindMatch)
    bindMatch(ctx: StateContext<MatchStateModel>) {
        this._observers++;
        if (!(this._unbind$)) {
            this._unbind$ = new Subject<void>();
            ctx.patchState({ loading: true });
            this.cloudData.getWaitingPlayers$().pipe(
                takeUntil(this._unbind$),
                tap((waitingPlayers: WaitingPlayer[]) => {
                    ctx.dispatch(new UpdateMatch(waitingPlayers));
                }),
                catchError((error) => {
                    ctx.dispatch(new UpdateMatch(null));
                    this.notification.quickErrorToast('match.error.waitingPlayers');
                    return of();
                }),
                finalize(() => {
                    ctx.dispatch(new UpdateMatch(null));
                    this._unbind$ = null;
                })
            ).subscribe();
        }
    }

    @Action(UnbindMatch)
    unbindMatch(ctx: StateContext<MatchStateModel>) {
        this._observers--;
        if (this._observers <= 0) {
            this._observers = 0;
            if (this._unbind$) {
                this._unbind$.next();
            }
        }
    }

}
