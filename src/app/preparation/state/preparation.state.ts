import { Action, State, StateContext } from '@ngxs/store';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddPreparation } from './preparation.actions';

export class PreparationModel {
    adding?: boolean;
    unauthenticated?: boolean;
}

@State<PreparationModel>({
    name: 'preparation',
    defaults: {
    }
})

export class PreparationState {

    constructor(private cloudData: CloudFunctionsService) {}

    @Action(AddPreparation)
    playerUpdated(ctx: StateContext<PreparationModel>, action: AddPreparation) {
    }

}
