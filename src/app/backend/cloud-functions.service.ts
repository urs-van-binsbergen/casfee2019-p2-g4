import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { PreparationArgs, AddChallengeArgs, ShootArgs, UpdateUserArgs, RemoveChallengeArgs } from '@cloud-api/arguments';

@Injectable({ providedIn: 'root' })
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

    removePreparation(args: {}): Observable<any> {
        const callable = this.fns.httpsCallable('removePreparation');
        return callable(args);
    }

    addChallenge(args: AddChallengeArgs): Observable<any> {
        const callable = this.fns.httpsCallable('addChallenge');
        return callable(args);
    }

    removeChallenge(args: RemoveChallengeArgs): Observable<any> {
        const callable = this.fns.httpsCallable('removeChallenge');
        return callable(args);
    }

    shoot(args: ShootArgs): Observable<any> {
        const callable = this.fns.httpsCallable('shoot');
        return callable(args);
    }

    capitulate(args: {}): Observable<any> {
        const callable = this.fns.httpsCallable('capitulate');
        return callable(args);
    }

    deleteGameData(args: {}): Observable<any> {
        const callable = this.fns.httpsCallable('deleteGameData');
        return callable(args);
    }

}
