import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import COLL from '@cloud-api/firestore-collection-name-const';
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
            .then(x => x.data() as User);
    }

    /*
     * Load player once
     */
    getPlayer(uid: string): Promise<Player> {
        return this.afs.collection(COLL.PLAYERS).doc(uid).get()
            .toPromise()
            .then(x => x.data() as Player);
    }

    /*
     * Load player and be notified on changes
     */
    getPlayer$(uid: string): Observable<Player> {
        return this.afs.collection(COLL.PLAYERS).doc(uid).valueChanges()
            .pipe(map(x => x as Player));
    }

    /*
     * Load waiting player once
     */
    getWaitingPlayer(uid: string): Promise<WaitingPlayer> {
        return this.afs.collection(COLL.WAITING_PLAYERS).doc(uid).get()
            .toPromise()
            .then(x => x.data() as WaitingPlayer);
    }

    /*
     * Load hall entry once
     */
    getHallEntry(uid: string): Promise<HallEntry> {
        return this.afs.collection(COLL.HALL_ENTRIES).doc(uid).get()
            .toPromise()
            .then(x => x.data() as HallEntry);
    }

    /*
     * Load historic battle once
     */
    getHistoricBattle(id: string): Promise<HistoricBattle> {
        return this.afs.collection(COLL.HISTORIC_BATTLES).doc(id).get()
            .toPromise()
            .then(x => x.data() as HistoricBattle);
    }

}
