import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

/*
* Helper: Read typed data from a DocumentSnapshot. Exception if it does not exist.
*/
export function getData<TData>(doc: DocumentSnapshot, getError?: () => Error): TData {
    if (!doc.exists) {
        throw getError ? getError() : new Error('Document does not exist');
    }
    return doc.data() as TData;
}

/*
* Helper: Read typed data from a DocumentSnapshot. Return null if it does not exist.
*/
export function getDataOrNull<TData>(doc: DocumentSnapshot): TData | null {
    if (!doc.exists) {
        return null;
    }
    return doc.data() as TData;
}
