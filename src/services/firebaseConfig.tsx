import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQQTk4nH8MPndSiz_YJE_iv9UQ8bd3hf8",
  authDomain: "expense-tracker-dc2fa.firebaseapp.com",
  projectId: "expense-tracker-dc2fa",
  storageBucket: "expense-tracker-dc2fa.appspot.com",
  messagingSenderId: "503379203571",
  appId: "1:503379203571:web:c1858799e978feceba2e86",
  measurementId: "G-LTBMB41PTK"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { storage, auth, db };