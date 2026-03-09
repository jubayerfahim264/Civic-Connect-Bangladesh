import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export interface ServiceVisit {
  category: string;
  link: string;
  lastVisited: string; // ISO string
}

export async function trackServiceVisit(category: string, link: string) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(userRef);
    let history: ServiceVisit[] = [];

    if (snap.exists()) {
      history = snap.data().serviceHistory ?? [];
    }

    const existingIndex = history.findIndex((h) => h.category === category);
    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      history[existingIndex].lastVisited = now;
      history[existingIndex].link = link;
    } else {
      history.push({ category, link, lastVisited: now });
    }

    if (snap.exists()) {
      await updateDoc(userRef, { serviceHistory: history });
    } else {
      await setDoc(userRef, { serviceHistory: history }, { merge: true });
    }
  } catch (error) {
    console.error("Error tracking service visit:", error);
  }
}
