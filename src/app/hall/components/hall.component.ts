import { Component, OnInit, OnDestroy } from '@angular/core';
import { HallEntry } from '@cloud-api/core-models';
import { Store, Select } from '@ngxs/store';
import { BindHall, UnbindHall } from '../state/hall.actions';
import { HallState } from '../state/hall.state';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './hall.component.html'
})
export class HallComponent implements OnInit, OnDestroy {

    @Select(HallState.loading) loading$: Observable<boolean>;
    @Select(HallState.admirals) admirals$: Observable<HallEntry[]>;
    @Select(HallState.captains) captains$: Observable<HallEntry[]>;
    @Select(HallState.seamen) seamen$: Observable<HallEntry[]>;
    @Select(HallState.shipboys) shipboys$: Observable<HallEntry[]>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new BindHall());
    }

    ngOnDestroy(): void {
        this.store.dispatch(new UnbindHall());
    }

}
