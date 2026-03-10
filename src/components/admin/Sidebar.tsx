import { MouseEvent } from "react";
import {
  Home,
  BarChart2,
  Users,
  MessageSquare,
  Server,
  BookOpen,
  CheckSquare,
  Settings,
  Info,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName?: string;
  userEmail?: string;
}

const menuItems = [
  { label: "Home", icon: Home, tab: "stats" },
  { label: "Analytics", icon: BarChart2, tab: "analytics" },
  { label: "Clients", icon: Users, tab: "clients" },
  { label: "Messages", icon: MessageSquare, tab: "messages" },
  { label: "Services", icon: Server, tab: "services" },
  { label: "Blog", icon: BookOpen, tab: "blogs" },
  { label: "Tasks", icon: CheckSquare, tab: "tasks" },
];

export default function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  userName,
  userEmail,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        {
          true: "translate-x-0",
          false: "-translate-x-full",
        }[String(isOpen)]
      }`}
    >
      <div className="flex items-center justify-between p-6">
        <div className="text-xl font-bold tracking-wide">CivicConnect</div>
        <button
          className="lg:hidden text-white"
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => {
              setActiveTab(item.tab);
              onClose();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium w-full text-left ${
              activeTab === item.tab
                ? "bg-blue-700 text-white"
                : "text-slate-500 hover:bg-blue-600/20"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-blue-600 space-y-2 text-sm">
        <button className="flex items-center gap-2 w-full hover:bg-blue-600/70 p-2 rounded">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <button className="flex items-center gap-2 w-full hover:bg-blue-600/70 p-2 rounded">
          <Info className="w-4 h-4" /> About
        </button>
        <button className="flex items-center gap-2 w-full hover:bg-blue-600/70 p-2 rounded">
          <MessageCircle className="w-4 h-4" /> Feedback
        </button>

        {/* promotional card */}
        <div className="mt-4 bg-blue-50 p-3 rounded">
          <p className="text-xs">Plan about to expire</p>
        </div>

        {/* user profile */}
        <div className="mt-4 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
            alt="profile"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {userName || "Jubayer Fahim"}
            </span>
            <span className="text-xs text-slate-500">
              {userEmail || "jubayerf217@gmail.com"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
