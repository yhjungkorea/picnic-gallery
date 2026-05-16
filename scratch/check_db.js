import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: 'C:/Users/YHJung/.gemini/antigravity/scratch/picnic-gallery/.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  if (querySnapshot.empty) {
    console.log("No teams found in 'teams' collection.");
    return;
  }
  const firstDoc = querySnapshot.docs[0];
  console.log("Team ID:", firstDoc.id);
  console.log("Team Data:", JSON.stringify(firstDoc.data(), null, 2));
}

checkData().catch(console.error);
