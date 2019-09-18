import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

/*
 * Challenge (TODO: Modelle einführen. Habe das nur als Test eingeführt, wie es ginge)
 */
export interface Challenge {
    uid: string,
    challengeDate: Date
}

/*
 * Helper: Read data from a DocumentSnapshot. Exception if it does not exist. 
 */
export function loadData(doc: DocumentSnapshot): any {
    if (!doc.exists) {
        throw "Document does not exist!";
    }
    return doc.data() || {};
}
