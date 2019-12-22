import { Component, OnInit } from '@angular/core';
import { HallEntry, PlayerLevel } from '@cloud-api/core-models';
import * as HallMethods from '../hall-methods';
import { Store, Select } from '@ngxs/store';
import { GetHallEntries } from '../state/hall.actions';
import { HallState } from '../state/hall.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './hall.component.html'
})
export class HallComponent implements OnInit {

    @Select(HallState.loading) loading$: Observable<boolean>;
    @Select(HallState.hallEntries) hallEntries$: Observable<HallEntry[]>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new GetHallEntries());
    }

    // TODO: better apply some group-by-mechanism. in the action or in the component?

    get admirals(): Observable<HallEntry[]> {
        return this.hallEntries$.pipe(
            map(list => HallMethods.filterByLevel(list, PlayerLevel.Admiral))
        );
    }

    get captains(): Observable<HallEntry[]> {
        return this.hallEntries$.pipe(
            map(list => HallMethods.filterByLevel(list, PlayerLevel.Captain))
        );
    }

    get seamen(): Observable<HallEntry[]> {
        return this.hallEntries$.pipe(
            map(list => HallMethods.filterByLevel(list, PlayerLevel.Seaman))
        );
    }

    get shipboys(): Observable<HallEntry[]> {
        return this.hallEntries$.pipe(
            map(list => HallMethods.filterByLevel(list, PlayerLevel.Shipboy))
        );
    }

}
