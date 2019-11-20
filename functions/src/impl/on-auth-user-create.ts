import { auth } from 'firebase-admin';
import { setUser } from '../shared/db/user';

/*
 * Auth trigger: create a user record in the database on registration
 */
export default function onAuthUserCreate(
    userRecord: auth.UserRecord,
    db: FirebaseFirestore.Firestore
) {
    const args = {
        displayName: userRecord.displayName || null,
        avatarFileName: null,
        email: userRecord.email || null,
    };
    return setUser(db, userRecord.uid, args, false);
}
