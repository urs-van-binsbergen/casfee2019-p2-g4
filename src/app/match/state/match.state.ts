import { Action, State, Selector, StateContext, Store } from '@ngxs/store';
import { Subject, throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddChallenge, BindMatch, CancelMatch, RemoveChallenge, UnbindMatch, BindingMatch, UpdateWaitingPlayers } from './match.actions';
import { WaitingPlayer } from '@cloud-api/core-models';
import { NotificationService } from 'src/app/shared/notification.service';

export class MatchModel {
    loading: boolean;
    waitingPlayers: WaitingPlayer[] | null;
}

@State<MatchModel>({
    name: 'match',
    defaults: {
        loading: false,
        waitingPlayers: null
    }
})

export class MatchState {

    private _unbind$: Subject<void>;
    private _observers: number;

    constructor(
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private notification: NotificationService
    ) {
        this._unbind$ = null;
        this._observers = 0;
    }

    @Selector()
    public static loading(state: MatchModel): boolean {
        return state.loading;
    }

    @Selector()
    public static waitingPlayers(state: MatchModel): WaitingPlayer[] {
        return state.waitingPlayers;
    }

    @Action(AddChallenge)
    addChallenge(ctx: StateContext<MatchModel>, action: AddChallenge) {
        return this.cloudFunctions.addChallenge({ opponentUid: action.opponentUid }).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('match.error.add');
                return throwError(error);
            })
        );
    }

    @Action(RemoveChallenge)
    removeChallenge(ctx: StateContext<MatchModel>, action: RemoveChallenge) {
        return this.cloudFunctions.removeChallenge({ opponentUid: action.opponentUid }).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('match.error.remove');
                return throwError(error);
            })
        );
    }

    @Action(CancelMatch)
    cancelMatch(ctx: StateContext<MatchModel>) {
        return this.cloudFunctions.removePreparation({}).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('match.error.cancel');
                return throwError(error);
            })
        );
    }

    @Action(UpdateWaitingPlayers)
    UpdateWaitingPlayers(ctx: StateContext<MatchModel>, action: UpdateWaitingPlayers) {
        ctx.patchState({ waitingPlayers: action.waitingPlayers });
    }

    @Action(BindMatch)
    bindMatch(ctx: StateContext<MatchModel>) {
        this._observers++;
        if (!(this._unbind$)) {
            ctx.dispatch(new BindingMatch());
        }
    }

    @Action(BindingMatch, { cancelUncompleted: true })
    bindingMatch(ctx: StateContext<MatchModel>) {
        this._unbind$ = new Subject<void>();
        ctx.patchState({ loading: true });
        return this.cloudData.getWaitingPlayers$().pipe(
            takeUntil(this._unbind$),
            tap((waitingPlayers: WaitingPlayer[]) => {
                ctx.patchState({ loading: false });
                ctx.dispatch(new UpdateWaitingPlayers(waitingPlayers));
            }),
            catchError((error) => {
                ctx.patchState({ loading: false });
                ctx.dispatch(new UpdateWaitingPlayers(null));
                this.notification.quickErrorToast('match.error.waitingPlayers');
                return throwError(error);
            }),
            finalize(() => {
                ctx.patchState({ loading: false });
                ctx.dispatch(new UpdateWaitingPlayers(null));
            })
        );
    }

    @Action(UnbindMatch)
    unbindMatch(ctx: StateContext<MatchModel>) {
        this._observers--;
        if (this._observers <= 0) {
            this._observers = 0;
            if (this._unbind$) {
                this._unbind$.next();
                this._unbind$ = null;
            }
        }
    }

}
