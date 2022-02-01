import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEU-PPDsdnqCk1G-agxvXH8QLix4GtF6k",
  authDomain: "challenge-55061.firebaseapp.com",
  projectId: "challenge-55061",
  storageBucket: "challenge-55061.appspot.com",
  messagingSenderId: "662654189779",
  appId: "1:662654189779:web:cc2b12c0dbd92e72ba9426",
  measurementId: "G-QLLZ859KR8"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);
//const provider=new GoogleAuthProvider()

export { app, db, auth };
