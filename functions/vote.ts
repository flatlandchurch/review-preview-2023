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
  const { id, value, user_id } = JSON.parse(event.body);

  const db = admin.database();
  const ref = db.ref(`rp_2024/votes/${id}`);

  await ref.child(user_id).set({
    value,
    created_at: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Vote added" }),
  };
};

export { handler };
