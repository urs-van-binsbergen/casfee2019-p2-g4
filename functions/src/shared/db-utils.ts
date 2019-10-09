import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

/*
 * Helper: Read data from a DocumentSnapshot. Exception if it does not exist.
 */
export function loadData(doc: DocumentSnapshot): any {
    if (!doc.exists) {
        throw new Error('Document does not exist!');
    }
    return doc.data() || {};
}

