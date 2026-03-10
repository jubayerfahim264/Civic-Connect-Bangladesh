import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAES1vuarXz2aWHTIv9utEMT_VGm1gQo2Y",
  authDomain: "civicconnect-bangladesh.firebaseapp.com",
  databaseURL: "https://civicconnect-bangladesh-default-rtdb.firebaseio.com",
  projectId: "civicconnect-bangladesh",
  storageBucket: "civicconnect-bangladesh.firebasestorage.app",
  messagingSenderId: "852202875693",
  appId: "1:852202875693:web:0448348e140d379af781a4",
  measurementId: "G-WQ3P7QMC0P",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
