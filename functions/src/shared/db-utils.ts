import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

/*
* Helper: Read typed data from a DocumentSnapshot. Exception if it does not exist.
*/
export function getData<TData>(doc: DocumentSnapshot): TData {
    if (!doc.exists) {
        throw new Error("Document does not exist");
    }
    return doc.data() as TData;
}
