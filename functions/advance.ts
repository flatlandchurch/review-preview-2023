import { Handler, HandlerEvent } from "@netlify/functions";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://move-to-the-center.firebaseio.com",
});
const handler: Handler = async (event: HandlerEvent) => {
  const { direction } = JSON.parse(event.body);

  const db = admin.database();
  const ref = db.ref(`rp_2024/items`);
  const currentIdx = await db
    .ref("rp_2024/current_index")
    .get()
    .then((s) => s.val());

  const items = await ref.get().then((snapshot) => {
    return snapshot.val();
  });

  const nextIndex =
    ((direction === "next" ? 1 : -1) + currentIdx) % items.length;

  await db.ref("rp_2024/current_index").set(nextIndex);

  return {
    statusCode: 200,
    body: JSON.stringify({ progressed: true }),
  };
};

export { handler };
