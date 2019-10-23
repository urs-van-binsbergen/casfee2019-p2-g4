import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class CloudDataService {

    constructor(
        private afs: AngularFirestore
    ) {

    }

}
