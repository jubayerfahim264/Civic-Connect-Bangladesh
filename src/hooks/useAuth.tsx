import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean; // auth initialization
  isAdmin: boolean; // true when user.email === adminEmail from Firestore
  adminLoading: boolean; // waiting on Firestore lookup
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // whenever the user object changes, re‑check Firestore
  useEffect(() => {
    setAdminLoading(true);

    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const adminDoc = doc(db, "settings", "admin_config"); // <–– note path
        const snap = await getDoc(adminDoc);
        if (snap.exists()) {
          const data = snap.data();
          setIsAdmin(data.adminEmail === user.email);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("failed to verify admin status", err);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
