import { Action, State, StateContext } from '@ngxs/store';
import { PreparationArgs } from '@cloud-api/arguments';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddPreparation } from './preparation.actions';
import { NotificationService } from 'src/app/shared/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class PreparationModel {
}

@State<PreparationModel>({
    name: 'preparation',
    defaults: {
    }
})

export class PreparationState {

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private notification: NotificationService
    ) {
    }

    @Action(AddPreparation)
    addPreparation(ctx: StateContext<PreparationModel>, action: AddPreparation) {
        const args: PreparationArgs = {
            size: { w: action.width, h: action.height },
            ships: [...action.ships]
        };
        return this.cloudFunctions.addPreparation(args).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('preparation.error');
                return throwError(error);
            })
        );
    }

}
