import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { PreparationArgs, AddChallengeArgs, ShootArgs, UpdateUserArgs } from '@cloud-api/arguments';

@Injectable()
export class CloudFunctionsService {

    constructor(
        private fns: AngularFireFunctions,
    ) {

    }

    updateUser(args: UpdateUserArgs): Observable<any> {
        const callable = this.fns.httpsCallable('updateUser');
        return callable(args);
    }

    addPreparation(args: PreparationArgs): Observable<any> {
        const callable = this.fns.httpsCallable('addPreparation');
        return callable(args);
    }

    addChallenge(args: AddChallengeArgs): Observable<any> {
        const callable = this.fns.httpsCallable('addChallenge');
        return callable(args);
    }

    shoot(args: ShootArgs): Observable<any> {
        const callable = this.fns.httpsCallable('shoot');
        return callable(args);
    }

    purgeMiniGame(args: {}): Observable<any> {
        const callable = this.fns.httpsCallable('purgeMiniGame');
        return callable(args);
    }

}
