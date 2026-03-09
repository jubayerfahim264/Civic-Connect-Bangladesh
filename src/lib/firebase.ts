import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config — these are publishable client-side keys.
// Replace with your own Firebase project config.
const firebaseConfig = {
  apiKey: "AIzaSyAES1vuarXz2aWHTIv9utEMT_VGm1gQo2Y",
  authDomain: "civicconnect-bangladesh.firebaseapp.com",
  projectId: "civicconnect-bangladesh",
  storageBucket: "civicconnect-bangladesh.firebasestorage.app",
  messagingSenderId: "852202875693",
  appId: "1:852202875693:web:0448348e140d379af781a4",
  measurementId: "G-WQ3P7QMC0P",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
