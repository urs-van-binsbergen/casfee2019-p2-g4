import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { map, tap } from 'rxjs/operators';

@Component({
    templateUrl: './mini-prep.component.html',
})
export class MiniPrepComponent implements OnInit {
    title = 'Preparation';

    serviceResult$: Observable<any>;
    myPreparation$: Observable<any>;

    miniGameNumber: number;

    constructor(
        private fns: AngularFireFunctions,
        private afs: AngularFirestore,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.myPreparation$ = this.afs.collection('preparations')
            .doc(this.authService.uid).snapshotChanges().pipe(
                map(
                    action => {
                        return action.payload.data();
                    }
                ),
                tap(
                    x => { this.miniGameNumber = x ? x.miniGameNumber : null; }
                )
            );
    }

    async submit() {
        const num = this.miniGameNumber;
        if (!num) {
            alert('number missing'); // TODO
            return;
        }
        const callable = this.fns.httpsCallable('addPreparation');
        this.serviceResult$ = callable({ miniGameNumber: num });
    }

}
