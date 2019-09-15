import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
    templateUrl: './mini-match.component.html',
})
export class MiniMatchComponent implements OnInit {
    title = 'Match';

    waitingPlayers$: Observable<any[]>;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private afs: AngularFirestore,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        // The following is ok when we only want the data
        // this.waitingPlayers$ = this.afs.collection<any>('waitingPlayers').valueChanges();

        // https://stackoverflow.com/questions/46900430/firestore-getting-documents-id-from-collection
        // To obtain the id of the documents in a collection, you must use snapshotChanges()

        const waitingPlayers = this.afs.collection<any>('waitingPlayers');
        // .snapshotChanges() returns a DocumentChangeAction[], which contains
        // a lot of information about "what happened" with each change. If you want to
        // get the data and the id use the map operator.
        this.waitingPlayers$ = waitingPlayers.snapshotChanges().pipe(
            map(actions => actions.map(
                action => {
                    const data = action.payload.doc.data();
                    const id = action.payload.doc.id;
                    return { id, me: this.authService.uid === id, ...data };
                }
            ))
        );
    }
}

