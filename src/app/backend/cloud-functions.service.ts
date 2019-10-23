import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PreparationArgs } from '@cloud-api/preparation';
import { Observable } from 'rxjs';
import { AddChallengeArgs } from '@cloud-api/match';
import { MakeGuessArgs, PurgeMiniGameArgs } from '@cloud-api/mini-game';

@Injectable()
export class CloudFunctionsService {

    constructor(
        private fns: AngularFireFunctions,
    ) {

    }

    addPreparation(args: PreparationArgs): Observable<any> {
        const callable = this.fns.httpsCallable('addPreparation');
        return callable(args);
    }

    addChallenge(args: AddChallengeArgs): Observable<any> {
        const callable = this.fns.httpsCallable('addChallenge');
        return callable(args);
    }

    makeGuess(args: MakeGuessArgs): Observable<any> {
        const callable = this.fns.httpsCallable('makeGuess');
        return callable(args);
    }

    purgeMiniGame(args: PurgeMiniGameArgs): Observable<any> {
        const callable = this.fns.httpsCallable('purgeMiniGame');
        return callable(args);
    }

}
