import { Selector, Action, State, StateContext, Store } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { BindHall, UnbindHall, UpdateHall } from './hall.actions';
import { HallEntry, PlayerLevel } from '@cloud-api/core-models';
import { Subject, of } from 'rxjs';
import { takeUntil, tap, catchError, finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import * as HallMethods from '../model/hall-methods';

export interface HallStateModel {
    loading: boolean;
    admirals: HallEntry[];
    captains: HallEntry[];
    seamen: HallEntry[];
    shipboys: HallEntry[];
}

@State<HallStateModel>({
    name: 'hall',
    defaults: {
        loading: false,
        admirals: [],
        captains: [],
        seamen: [],
        shipboys: []
    }
})

export class HallState {

    private _unbind$: Subject<void>;
    private _observers: number;

    constructor(
        private cloudData: CloudDataService,
        private notification: NotificationService
    ) {
        this._unbind$ = null;
        this._observers = 0;
    }

    @Selector()
    public static loading(state: HallStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static admirals(state: HallStateModel): HallEntry[] {
        return state.admirals;
    }

    @Selector()
    public static captains(state: HallStateModel): HallEntry[] {
        return state.captains;
    }

    @Selector()
    public static seamen(state: HallStateModel): HallEntry[] {
        return state.seamen;
    }

    @Selector()
    public static shipboys(state: HallStateModel): HallEntry[] {
        return state.shipboys;
    }

    @Action(UpdateHall)
    updateHall(ctx: StateContext<HallStateModel>, action: UpdateHall) {
        const admirals = HallMethods.filterByLevel(action.entries, PlayerLevel.Admiral);
        const captains = HallMethods.filterByLevel(action.entries, PlayerLevel.Captain);
        const seamen = HallMethods.filterByLevel(action.entries, PlayerLevel.Seaman);
        const shipboys = HallMethods.filterByLevel(action.entries, PlayerLevel.Shipboy);
        ctx.setState({ loading: false, admirals, captains, seamen, shipboys});
    }

    @Action(BindHall)
    bindMatch(ctx: StateContext<HallStateModel>) {
        this._observers++;
        if (!(this._unbind$)) {
            this._unbind$ = new Subject<void>();
            ctx.patchState({ loading: true });
            this.cloudData.getHallEntries$().pipe(
                takeUntil(this._unbind$),
                tap((entries: HallEntry[]) => {
                    ctx.dispatch(new UpdateHall(entries));
                }),
                catchError((error) => {
                    ctx.dispatch(new UpdateHall([]));
                    this.notification.quickErrorToast('hall.error.entries');
                    return of();
                }),
                finalize(() => {
                    ctx.dispatch(new UpdateHall([]));
                    this._unbind$ = null;
                })
            ).subscribe();
        }
    }

    @Action(UnbindHall)
    unbindMatch(ctx: StateContext<HallStateModel>) {
        this._observers--;
        if (this._observers <= 0) {
            this._observers = 0;
            if (this._unbind$) {
                this._unbind$.next();
            }
        }
    }

}
