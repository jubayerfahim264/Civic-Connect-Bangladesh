import { Search, Calendar, Bell, SunMoon, LogOut } from "lucide-react";
import { ChangeEvent } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: string;
  userName?: string;
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({
  onMenuClick,
  activeTab,
  userName,
  onLogout,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 h-16 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <nav className="text-sm text-slate-600">
          Dashboard <span className="text-slate-400">›</span> {activeTab}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 h-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
        <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800">
          <Calendar className="w-4 h-4" />{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <SunMoon className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onLogout}
            className="text-sm text-red-500 flex items-center gap-1 hover:text-red-700"
          >
            <LogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
