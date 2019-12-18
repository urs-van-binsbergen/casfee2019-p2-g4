import { Selector, Action, State, StateContext, Store } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { GetHallEntries } from './hall.actions';
import { HallEntry } from '@cloud-api/core-models';

export class HallStateModel {
    loading: boolean;
    hallEntries: HallEntry[];
}

@State<HallStateModel>({
    name: 'hall',
    defaults: {
        loading: false,
        hallEntries: []
    }
})

export class HallState {

    constructor(
        private cloudData: CloudDataService
    ) { }


    @Selector()
    public static loading(state: HallStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static hallEntries(state: HallStateModel): HallEntry[] {
        return state.hallEntries;
    }

    @Action(GetHallEntries)
    getHallEntries({ patchState }: StateContext<HallStateModel>) {
        patchState({ loading: true });

        return this.cloudData.getHallEntries()
            .then(hallEntries => {
                patchState({ loading: false, hallEntries });
            });
    }

}
