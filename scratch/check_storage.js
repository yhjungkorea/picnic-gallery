import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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
const storage = getStorage(app);
const db = getFirestore(app);

async function checkStorage() {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  if (querySnapshot.empty) {
    console.log("No teams found.");
    return;
  }
  const team = querySnapshot.docs[0].data();
  console.log("Testing for team:", team.teamName);
  
  const rootRef = ref(storage, 'mission-photos');
  try {
    const rootRes = await listAll(rootRef);
    console.log("Folders in mission-photos:", rootRes.prefixes.map(p => p.name));
    
    if (rootRes.prefixes.length > 0) {
      const firstFolder = rootRes.prefixes[0];
      const folderRes = await listAll(firstFolder);
      console.log(`Files in ${firstFolder.name}:`, folderRes.items.map(i => i.name));
    }
  } catch (e) {
    console.error("Storage error:", e);
  }
}

checkStorage().catch(console.error);
