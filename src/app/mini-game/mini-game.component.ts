import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
    templateUrl: './mini-game.component.html',
})
export class MiniGameComponent implements OnInit {
    title = 'Mini Game';

    serviceResult$: Observable<any>;

    constructor(
        private afs: AngularFirestore,
        private authService: AuthService,
        private fns: AngularFireFunctions
    ) {
    }

    ngOnInit(): void {
    }

    async purge() {
        const callable = this.fns.httpsCallable('purgeMiniGame');
        this.serviceResult$ = callable({});
    }
}
