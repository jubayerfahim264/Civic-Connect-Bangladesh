import { Menu, X, User, LogIn, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SimpleService {
  id: string;
  title: string;
}

// blogCategories no longer needed; service titles will be loaded dynamically

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [services, setServices] = useState<SimpleService[]>([]);
  const [blogCategories, setBlogCategories] = useState<string[]>([]);
  const { user, isAdmin } = useAuth();

  // realtime subscription to services collection for dropdown
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snap) => {
      const data: SimpleService[] = snap.docs.map((d) => ({
        id: d.id,

        title: d.data().title,
      }));
      setServices(data);
    });
    return unsubscribe;
  }, []);

  // realtime subscription to blog categories collection for dropdown
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "blogCategories"), (snap) => {
      const data: string[] = snap.docs.map((d) => {
        return d.data().name || d.id;
      });
      setBlogCategories(data);
    });
    return unsubscribe;
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-navy text-white font-bangla">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <span className="text-lg font-bold text-navy">C</span>
          </div>
          <span className="font-heading text-xl font-bold text-white">
            CivicConnect
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              to="/"
              className="text-sm font-medium hover:text-emerald-300 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="relative group">
            <Link
              to="/services"
              className="flex items-center text-sm font-medium hover:text-emerald-300 transition-colors"
            >
              Services
            </Link>
          </li>
          <li className="relative group">
            <Link
              to="/blog"
              className="flex items-center text-sm font-medium hover:text-emerald-300 transition-colors"
            >
              Blog
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-emerald-300 transition-colors"
            >
              Contact
            </Link>
          </li>
          <li>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </li>
          {user && isAdmin && (
            <li>
              <Link
                to="/admin"
                className="text-sm font-medium hover:text-emerald-300 transition-colors"
              >
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        <button
          className="md:hidden text-white"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setBlogOpen(false);
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-navy-light bg-navy px-6 py-4 md:hidden animate-fade-in">
          <Link
            to="/"
            className="block py-3 text-sm font-medium text-white hover:text-navy-light"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="block py-3 text-sm font-medium text-white hover:text-navy-light"
            onClick={() => setMobileOpen(false)}
          >
            Services
          </Link>

          <Link
            to="/#blog"
            className="block py-3 text-sm font-medium text-white hover:text-navy-light"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="block py-3 text-sm font-medium text-white hover:text-navy-light"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-4">
            {user ? (
              <Link
                to="/profile"
                className="block text-sm font-medium text-white hover:text-navy-light"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="block py-3 text-sm font-medium text-white hover:text-navy-light"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
            {user && isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="text-sm font-medium hover:text-emerald-300 transition-colors list-none block py-3 text-sm font-medium text-white hover:text-navy-light"
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
