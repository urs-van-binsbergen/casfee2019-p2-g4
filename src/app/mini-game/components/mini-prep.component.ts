import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { AuthStateService } from '../../auth/auth-state.service';
import { PreparationArgs } from '@cloud-api/preparation';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from '../../auth/notification.service';
import { Player } from '@cloud-api/core-models';

@Component({
    templateUrl: './mini-prep.component.html',
})
export class MiniPrepComponent implements OnInit {
    miniGameNumber = new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]);
    form = new FormGroup({
        miniGameNumber: this.miniGameNumber,
    });

    player: Player | null;

    waiting = false;

    constructor(
        private fns: AngularFireFunctions,
        private afs: AngularFirestore,
        private authState: AuthStateService,
        private notification: NotificationService
    ) {
    }

    ngOnInit(): void {
        this.afs.collection('players')
            .doc(this.authState.currentUser.uid).snapshotChanges().pipe(
                map(
                    action => {
                        return action.payload.data();
                    }
                ),
                tap(
                    (x: Player | null) => {
                        console.log("tapped player", x);
                        this.player = x;
                        this.miniGameNumber.setValue(x ? x.miniGameNumber : null);
                    }
                )
            )
            .subscribe();
    }

    onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;

        const args: PreparationArgs = {
            miniGameNumber: this.miniGameNumber.value,
            ships: []
        };

        const callable = this.fns.httpsCallable('addPreparation');
        callable(args).toPromise()
            .then(x => {
                this.waiting = false;
            })
            .catch(err => {
                this.waiting = false;
            })
            ;
    }

}
