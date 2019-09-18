export default function helloFirestore (
    snap: FirebaseFirestore.DocumentSnapshot,
    db: FirebaseFirestore.Firestore
) {
    var data = snap.data();
    if (!data) {
        return;
    }

    const name: string = data.name;

    db.collection("items2").doc("LA").set({
        name: name,
        test: "CA"
    })

    return "ok";
}