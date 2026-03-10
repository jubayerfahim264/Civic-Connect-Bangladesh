import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HistoryItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mockHistory: HistoryItem[] = [
  { label: "Politics", href: "/blog/category/politics", icon: Clock },
  { label: "IT", href: "/blog/category/it", icon: Clock },
  { label: "Economics", href: "/blog/category/economics", icon: Clock },
];

const UserDashboard = () => {
  const { user } = useAuth();
  // replace with real history state in future
  const [history] = useState<HistoryItem[]>(mockHistory);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <div className="flex flex-col items-center">
          <User className="h-16 w-16 text-navy" />
          <h3 className="mt-2 text-lg font-semibold">
            {user?.displayName || user?.email || "User"}
          </h3>
        </div>
        <nav className="mt-8 space-y-4">
          <Link
            to="/profile"
            className="block text-sm text-foreground hover:text-primary"
          >
            Profile Settings
          </Link>
          <Link
            to="/profile/password"
            className="block text-sm text-foreground hover:text-primary"
          >
            Change Password
          </Link>
          <Link
            to="/logout"
            className="block text-sm text-foreground hover:text-primary"
          >
            Log Out
          </Link>
        </nav>
      </aside>

      {/* main content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Recently Visited</h2>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Clock className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              কোনো ইতিহাস পাওয়া যায়নি
            </p>
            <Link
              to="/"
              className="mt-6 rounded-md bg-primary px-4 py-2 text-white"
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {history.map((item) => (
              <li
                key={item.label}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-navy" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <Link
                  to={item.href}
                  className="flex items-center text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4 mr-1" /> Back to page
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
