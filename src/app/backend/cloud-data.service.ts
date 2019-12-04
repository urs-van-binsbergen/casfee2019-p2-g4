import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import COLL from '@cloud-api/collection-names';
import { Player, User, HistoricBattle, WaitingPlayer, HallEntry } from '@cloud-api/core-models';

@Injectable()
export class CloudDataService {

    constructor(
        private afs: AngularFirestore
    ) {

    }

    /*
     * Load user once
     */
    getUser(uid: string): Promise<User> {
        return this.afs.collection(COLL.USERS).doc(uid).get()
            .toPromise()
            .then((x: DocumentSnapshot<User>) => getData(x));
    }

    /*
     * Load user (observable)
     */
    getUser$(uid: string): Observable<User> {
        return this.afs.collection(COLL.USERS).doc<User>(uid).valueChanges();
    }

    /*
     * Load player once
     */
    getPlayer(uid: string): Promise<Player> {
        return this.afs.collection(COLL.PLAYERS).doc<Player>(uid).get()
            .toPromise()
            .then((x: DocumentSnapshot<Player>) => getData(x));
    }

    /*
     * Load player and be notified on changes
     */
    getPlayer$(uid: string): Observable<Player> {
        return this.afs.collection(COLL.PLAYERS).doc<Player>(uid).valueChanges();
    }

    /*
     * Load waiting player once
     */
    getWaitingPlayer(uid: string): Promise<WaitingPlayer> {
        return this.afs.collection(COLL.WAITING_PLAYERS).doc(uid).get()
            .toPromise()
            .then((x: DocumentSnapshot<WaitingPlayer>) => getData(x));
    }

    /*
     * Load all waiting players (observable)
     */
    getWaitingPlayers$(): Observable<WaitingPlayer[]> {
        return this.afs.collection<WaitingPlayer>(COLL.WAITING_PLAYERS).valueChanges();
    }

    /*
     * Load hall entry once
     */
    getHallEntry(uid: string): Promise<HallEntry> {
        return this.afs.collection(COLL.HALL_ENTRIES).doc(uid).get()
            .toPromise()
            .then((x: DocumentSnapshot<HallEntry>) => getData(x));
    }

    /*
     * Load all hall entries once
     */
    getHallEntries(): Promise<HallEntry[]> {
        return this.afs.collection(COLL.HALL_ENTRIES).get()
            .toPromise()
            .then((snapshot: QuerySnapshot<HallEntry>) =>
                snapshot.docs.map(doc => doc.data() as HallEntry)
            );
    }

    /*
     * Load historic battle once
     */
    getHistoricBattle(id: string): Promise<HistoricBattle> {
        return this.afs.collection(COLL.HISTORIC_BATTLES).doc(id).get()
            .toPromise()
            .then((x: DocumentSnapshot<HistoricBattle>) => getData(x));
    }


    /*
     * Load all historic battles once
     */
    getHistoricBattles(): Promise<HistoricBattle[]> {
        return this.afs.collection(COLL.HISTORIC_BATTLES).get()
            .toPromise()
            .then((snapshot: QuerySnapshot<HistoricBattle>) =>
                snapshot.docs.map(doc => doc.data() as HistoricBattle)
            );
    }

    /*
     * Load all historic battles of a user once
     */
    getHistoricBattlesOf(uid: string): Promise<HistoricBattle[]> {
        return this.afs.collection(COLL.HISTORIC_BATTLES,
            ref => ref.where('uids', 'array-contains', uid)
                .orderBy('endDate')
        ).get()
            .toPromise()
            .then((snapshot: QuerySnapshot<HistoricBattle>) =>
                snapshot.docs.map(doc => doc.data() as HistoricBattle)
            );
    }
}

/*
* Helper: Read typed data from a DocumentSnapshot. Exception if it does not exist.
*/
function getData<TData>(doc: DocumentSnapshot<TData>): TData {
    if (!doc.exists) {
        throw new Error('Document does not exist');
    }
    return doc.data();
}
