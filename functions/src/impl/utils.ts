import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export interface Challenge {
    uid: string,
    challengeDate: Date
}

export function loadData(doc: DocumentSnapshot): any {
    if (!doc.exists) {
        throw "Document does not exist!";
    }
    return doc.data() || {};
}
