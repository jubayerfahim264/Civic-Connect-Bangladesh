/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
// Added auth and signOut imports for logging out
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { AdminService } from "@/types/service";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Trash2,
  Briefcase,
  X,
  LogOut,
  Settings,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  Mail,
  User,
  Eye,
  Edit,
  Search,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceTable from "@/components/admin/ServiceTable";
import ServiceForm from "@/components/admin/ServiceForm";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Message } from "@/types/message";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
// Added useNavigate for redirecting to the home page
import { useNavigate } from "react-router-dom";

const BLOG_CATEGORIES = [
  "General",
  "Announcement",
  "Update",
  "Tips",
  "Other",
  "IT",
  "Politics",
  "Warfare",
  "Health",
  "Education",
  "Environment",
  "Sports",
  "Entertainment",
  "Business",
  "Science",
  "Culture",
  "Travel",
  "Food",
  "Lifestyle",
  "Opinion",
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(
    null,
  );
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newHasCopyright, setNewHasCopyright] = useState(false);
  // messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // blog management helpers
  const [blogSearch, setBlogSearch] = useState("");
  const [blogPage, setBlogPage] = useState(1);
  const [hasCopyright, setHasCopyright] = useState(false);
  const BLOG_PAGE_SIZE = 5;

  const blogCategories = React.useMemo(
    () =>
      Array.from(new Set(blogs.map((b) => b.category || ""))).filter(Boolean),
    [blogs],
  );

  const filteredBlogs = React.useMemo(
    () =>
      blogs.filter(
        (b) =>
          blogSearch === "" ||
          b.title.toLowerCase().includes(blogSearch.toLowerCase()),
      ),
    [blogs, blogSearch],
  );

  const totalBlogPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / BLOG_PAGE_SIZE),
  );
  const paginatedBlogs = React.useMemo(() => {
    const start = (blogPage - 1) * BLOG_PAGE_SIZE;
    return filteredBlogs.slice(start, start + BLOG_PAGE_SIZE);
  }, [filteredBlogs, blogPage]);

  React.useEffect(() => {
    setBlogPage(1);
  }, [filteredBlogs]);

  const BLOG_CATEGORY_COLOR: Record<string, string> = {
    General: "bg-blue-100 text-blue-800",
    Announcement: "bg-green-100 text-green-800",
    Update: "bg-yellow-100 text-yellow-800",
    Tips: "bg-teal-100 text-teal-800",
    // fallback
    Other: "bg-slate-100 text-slate-800",
  };

  // clients state
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // derived analytics stats
  const totalUsers = clients.length;
  const newSignupsCount = React.useMemo(() => {
    const now = new Date();
    return clients.filter((c) => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [clients]);
  const activeSessionsCount = React.useMemo(() => {
    return clients.filter(
      (c) => c.lastActive && Date.now() - c.lastActive < 5 * 60 * 1000,
    ).length;
  }, [clients]);

  const sparkTotalUsers = React.useMemo(
    () => clients.slice(-7).map((_, i) => ({ value: i + 1 })),
    [clients],
  );
  const sparkNewSignups = React.useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    clients.forEach((c) => {
      if (c.createdAt) {
        const dateStr = new Date(c.createdAt).toISOString().slice(0, 10);
        if (days[dateStr] !== undefined) days[dateStr]++;
      }
    });
    return Object.values(days)
      .reverse()
      .map((v) => ({ value: v }));
  }, [clients]);
  const sparkActiveSessions = React.useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    clients.forEach((c) => {
      if (c.lastActive) {
        const dateStr = new Date(c.lastActive).toISOString().slice(0, 10);
        if (days[dateStr] !== undefined) days[dateStr]++;
      }
    });
    return Object.values(days)
      .reverse()
      .map((v) => ({ value: v }));
  }, [clients]);

  // chart datasets
  const areaData = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toISOString().slice(0, 10)] = 0;
    }
    clients.forEach((c) => {
      if (c.createdAt) {
        const dateStr = new Date(c.createdAt).toISOString().slice(0, 10);
        if (map[dateStr] !== undefined) map[dateStr]++;
      }
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [clients]);

  const barData = React.useMemo(() => {
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString("default", { month: "short" }));
    }
    return months.map((m) => ({
      month: m,
      views: Math.floor(Math.random() * 1000) + 200,
      requests: Math.floor(Math.random() * 500) + 50,
    }));
  }, []);

  const pieData = React.useMemo(
    () => [
      { name: "Politics", value: 40 },
      { name: "IT", value: 30 },
      { name: "Warfare", value: 30 },
    ],
    [],
  );

  const lineData = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map[d.toISOString().slice(0, 10)] = 0;
    }
    clients.forEach((c) => {
      if (c.lastActive) {
        const dateStr = new Date(c.lastActive).toISOString().slice(0, 10);
        if (map[dateStr] !== undefined) map[dateStr]++;
      }
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [clients]);

  const analyticsLoading =
    clientsLoading || messageLoading || blogLoading || loading;

  // computed stats
  const usersCount = clients.length; // now counts actual users
  const conversionsCount = messages.length;
  const eventCount = blogs.length;

  // sparkline data (dummy for now)
  const sparkUsers = React.useMemo(
    () => services.slice(-7).map((s, i) => ({ value: i + 1 })),
    [services],
  );
  const sparkConversions = React.useMemo(
    () => messages.slice(-7).map((m, i) => ({ value: i + 1 })),
    [messages],
  );
  const sparkEvents = React.useMemo(
    () => blogs.slice(-7).map((b, i) => ({ value: i + 1 })),
    [blogs],
  );
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyBody, setReplyBody] = useState("");

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully", variant: "default" });
      navigate("/"); // Redirects back to the home page
    } catch (error) {
      toast({ title: "Error logging out", variant: "destructive" });
    }
  };

  // Service CRUD handlers
  const openAdd = () => {
    setEditingService(null);
    setFormOpen(true);
  };
  const openEdit = (service: AdminService) => {
    setEditingService(service);
    setFormOpen(true);
  };
  const handleAdd = async (data: AdminService) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "services"), {
        ...data,
        createdAt: Date.now(),
      });
      toast({ title: "Service added!", variant: "default" });
      setFormOpen(false);
    } catch (e) {
      toast({ title: "Error adding service", variant: "destructive" });
    }
    setLoading(false);
  };
  const handleUpdate = async (data: AdminService) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "services", data.id!), {
        ...data,
      });
      toast({ title: "Service updated!", variant: "default" });
      setFormOpen(false);
    } catch (e) {
      toast({ title: "Error updating service", variant: "destructive" });
    }
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "services", id));
      toast({ title: "Service deleted!", variant: "default" });
    } catch (e) {
      toast({ title: "Error deleting service", variant: "destructive" });
    }
    setLoading(false);
  };

  // Blog CRUD handlers
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogLoading(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title: newTitle,
        content: newContent,
        imageUrl: newImageUrl,
        category: newCategory,
        hasCopyright: newHasCopyright,
        createdAt: Date.now(),
      });
      toast({ title: "Blog added!", variant: "default" });
      setNewTitle("");
      setNewContent("");
      setNewImageUrl("");
      setNewCategory("General");
      setNewHasCopyright(false);
      setEditingBlog(null);
    } catch (e) {
      toast({ title: "Error adding blog", variant: "destructive" });
    }
    setBlogLoading(false);
  };
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogLoading(true);
    try {
      await updateDoc(doc(db, "blogs", editingBlog.id!), {
        title: newTitle,
        content: newContent,
        imageUrl: newImageUrl,
        category: newCategory,
        hasCopyright: newHasCopyright,
      });
      toast({ title: "Blog updated!", variant: "default" });
      setEditingBlog(null);
      setNewTitle("");
      setNewContent("");
      setNewImageUrl("");
      setNewCategory("General");
      setNewHasCopyright(false);
    } catch (e) {
      toast({ title: "Error updating blog", variant: "destructive" });
    }
    setBlogLoading(false);
  };
  const handleDeleteBlog = async (id: string) => {
    setBlogLoading(true);
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast({ title: "Blog deleted!", variant: "default" });
    } catch (e) {
      toast({ title: "Error deleting blog", variant: "destructive" });
    }
    setBlogLoading(false);
  };

  const handleDeleteMessage = async (id: string) => {
    setMessageLoading(true);
    try {
      await deleteDoc(doc(db, "messages", id));
      toast({ title: "Message deleted!", variant: "default" });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setReplyBody("");
      }
    } catch (e) {
      toast({ title: "Error deleting message", variant: "destructive" });
    }
    setMessageLoading(false);
  };

  // Clear selected message when switching tabs
  useEffect(() => {
    if (activeTab !== "messages") {
      setSelectedMessage(null);
      setReplyBody("");
    }
  }, [activeTab]);

  // Real-time listeners
  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      const data: AdminService[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as AdminService),
      }));
      setServices(data);
      setLoading(false);
    });
    const unsubBlogs = onSnapshot(collection(db, "blogs"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setBlogs(data);
      setBlogLoading(false);
    });

    const unsubMsgs = onSnapshot(collection(db, "messages"), (snap) => {
      const data: Message[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Message),
      }));
      setMessages(data);
      setMessageLoading(false);
    });

    const unsubClients = onSnapshot(collection(db, "users"), (snap) => {
      const data: any[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setClients(data);
      setClientsLoading(false);
    });

    return () => {
      unsubServices();
      unsubBlogs();
      unsubMsgs();
      unsubClients();
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar (mobile toggle handled inside component) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t)}
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Right Side Content Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header component */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          activeTab={activeTab}
          userName={user?.displayName || user?.email || "Administrator"}
          onLogout={handleLogout}
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* OVERVIEW / STATS */}
            {activeTab === "stats" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Users card */}
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Users
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {usersCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-blue-500">+25%</p>
                      <ChartContainer
                        config={
                          {
                            type: "sparkline",
                            dataKey: "value",
                            stroke: "#F87171",
                          } as any
                        }
                        style={{ height: 40 }}
                      >
                        <LineChart
                          data={sparkUsers}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>

                  {/* Conversions card */}
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Conversions
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {conversionsCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-red-500">-25%</p>
                      <ChartContainer
                        config={
                          {
                            type: "sparkline",
                            dataKey: "value",
                            stroke: "#F87171",
                          } as any
                        }
                        style={{ height: 40 }}
                      >
                        <LineChart
                          data={sparkConversions}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#F87171"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>

                  {/* Event count card */}
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Event count
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {eventCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-blue-500">+5%</p>
                      <ChartContainer
                        config={
                          {
                            type: "sparkline",
                            dataKey: "value",
                            stroke: "#60A5FA",
                          } as any
                        }
                        style={{ height: 40 }}
                      >
                        <LineChart
                          data={sparkEvents}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>

                {/* secondary charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Sessions (13,277, +35%)
                    </p>
                    <ChartContainer
                      config={{
                        sessions: { color: "#60A5FA" },
                      }}
                      style={{ height: 200 }}
                    >
                      {/* Area chart placeholder */}
                      <LineChart
                        data={[
                          { sessions: 10 },
                          { sessions: 20 },
                          { sessions: 15 },
                          { sessions: 30 },
                          { sessions: 25 },
                        ]}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="sessions"
                          stroke="#60A5FA"
                          strokeWidth={2}
                          fill="#60A5FA33"
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Page views & downloads (1.3M, -8%)
                    </p>
                    <ChartContainer
                      config={{
                        views: { color: "#60A5FA" },
                        downloads: { color: "#F87171" },
                      }}
                      style={{ height: 200 }}
                    >
                      {/* Stacked bar chart placeholder */}
                      <LineChart
                        data={[
                          { views: 100, downloads: 50 },
                          { views: 120, downloads: 40 },
                          { views: 140, downloads: 60 },
                          { views: 130, downloads: 30 },
                        ]}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#60A5FA"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="downloads"
                          stroke="#F87171"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>

                {/* bottom details table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto mb-8">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2">Page Title</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Users</th>
                        <th className="px-4 py-2">Event Count</th>
                        <th className="px-4 py-2">Views/User</th>
                        <th className="px-4 py-2">Avg Time</th>
                        <th className="px-4 py-2">Conversions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* placeholder rows */}
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="border-t">
                          <td className="px-4 py-2">Page {i}</td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                              Online
                            </span>
                          </td>
                          <td className="px-4 py-2">{100 * i}</td>
                          <td className="px-4 py-2">{200 * i}</td>
                          <td className="px-4 py-2">
                            {(Math.random() * 10).toFixed(1)}
                          </td>
                          <td className="px-4 py-2">
                            {(Math.random() * 5).toFixed(1)}m
                          </td>
                          <td className="px-4 py-2">
                            <ChartContainer
                              config={{
                                conv: { color: "#60A5FA" },
                              }}
                              style={{ height: 40, width: 100 }}
                            >
                              <LineChart
                                data={Array.from({ length: 7 }, () => ({
                                  conv: Math.random() * 10,
                                }))}
                                margin={{
                                  top: 0,
                                  right: 0,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <Line
                                  type="monotone"
                                  dataKey="conv"
                                  stroke="#60A5FA"
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ChartContainer>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <>
                {/* top stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {analyticsLoading ? (
                    [1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))
                  ) : (
                    <>
                      <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Total Users
                          </p>
                          <p className="text-3xl font-bold text-slate-800">
                            {totalUsers.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-4">
                          <ChartContainer
                            config={
                              {
                                type: "sparkline",
                                dataKey: "value",
                                stroke: "#60A5FA",
                              } as any
                            }
                            style={{ height: 40 }}
                          >
                            <LineChart
                              data={sparkTotalUsers}
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#60A5FA"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            New Signups
                          </p>
                          <p className="text-3xl font-bold text-slate-800">
                            {newSignupsCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-4">
                          <ChartContainer
                            config={
                              {
                                type: "sparkline",
                                dataKey: "value",
                                stroke: "#10B981",
                              } as any
                            }
                            style={{ height: 40 }}
                          >
                            <LineChart
                              data={sparkNewSignups}
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            Active Sessions
                          </p>
                          <p className="text-3xl font-bold text-slate-800">
                            {activeSessionsCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-4">
                          <ChartContainer
                            config={
                              {
                                type: "sparkline",
                                dataKey: "value",
                                stroke: "#14B8A6",
                              } as any
                            }
                            style={{ height: 40 }}
                          >
                            <LineChart
                              data={sparkActiveSessions}
                              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#14B8A6"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Growth of registered users (last 30 days)
                    </p>
                    {analyticsLoading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : (
                      <ChartContainer
                        config={{ count: { color: "#60A5FA" } }}
                        style={{ height: 200 }}
                      >
                        <AreaChart
                          data={areaData}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorCount"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#60A5FA"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="#60A5FA"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ReTooltip />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#60A5FA"
                            fill="url(#colorCount)"
                          />
                        </AreaChart>
                      </ChartContainer>
                    )}
                  </div>
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Page Views vs Service Requests
                    </p>
                    {analyticsLoading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : (
                      <ChartContainer
                        config={{
                          views: { color: "#60A5FA" },
                          requests: { color: "#F87171" },
                        }}
                        style={{ height: 200 }}
                      >
                        <BarChart
                          data={barData}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ReTooltip />
                          <Bar dataKey="views" stackId="a" fill="#60A5FA" />
                          <Bar dataKey="requests" stackId="a" fill="#F87171" />
                        </BarChart>
                      </ChartContainer>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Category distribution
                    </p>
                    {analyticsLoading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : (
                      <ChartContainer style={{ height: 200 }} config={{}}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0
                                    ? "#60A5FA"
                                    : index === 1
                                      ? "#10B981"
                                      : "#F87171"
                                }
                              />
                            ))}
                          </Pie>
                          <ReTooltip />
                        </PieChart>
                      </ChartContainer>
                    )}
                  </div>
                  <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-6">
                    <p className="text-base font-medium text-slate-800 mb-4">
                      Daily traffic
                    </p>
                    {analyticsLoading ? (
                      <Skeleton className="h-64 w-full" />
                    ) : (
                      <ChartContainer
                        config={{ count: { color: "#60A5FA" } }}
                        style={{ height: 200 }}
                      >
                        <LineChart
                          data={lineData}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ReTooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* CLIENTS */}
            {activeTab === "clients" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Last Active</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientsLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-4 py-2">
                                <Skeleton className="h-4 w-24" />
                              </td>
                              <td className="px-4 py-2">
                                <Skeleton className="h-4 w-32" />
                              </td>
                              <td className="px-4 py-2">
                                <Skeleton className="h-4 w-16" />
                              </td>
                              <td className="px-4 py-2">
                                <Skeleton className="h-4 w-20" />
                              </td>
                              <td className="px-4 py-2">
                                <Skeleton className="h-4 w-16" />
                              </td>
                            </tr>
                          ))
                        : clients
                            .filter(
                              (c) =>
                                searchTerm === "" ||
                                c.name
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                c.email
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase()),
                            )
                            .map((c) => {
                              const isOnline =
                                c.lastActive &&
                                Date.now() - c.lastActive < 5 * 60 * 1000;
                              return (
                                <tr
                                  key={c.id}
                                  className="border-t hover:bg-slate-50"
                                >
                                  <td className="px-4 py-2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-slate-500" />
                                    </div>
                                    {c.name || c.email}
                                  </td>
                                  <td className="px-4 py-2">{c.email}</td>
                                  <td className="px-4 py-2">
                                    <span
                                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                        isOnline
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {isOnline ? "Online" : "Offline"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    {c.lastActive
                                      ? new Date(c.lastActive).toLocaleString()
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-2 flex gap-2">
                                    <button className="p-1 hover:bg-slate-200 rounded">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 hover:bg-slate-200 rounded">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 lg:hidden">
                    Services
                  </h2>
                  <div className="flex w-full sm:w-auto gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                    <Button
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                      onClick={openAdd}
                    >
                      + Add Service
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 sm:p-4 overflow-x-auto">
                    <ServiceTable
                      services={services}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                )}

                <ServiceForm
                  open={formOpen}
                  onOpenChange={setFormOpen}
                  onSubmit={editingService ? handleUpdate : handleAdd}
                  initialData={editingService}
                />
              </div>
            )}

            {/* BLOGS */}
            {activeTab === "blogs" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 lg:hidden mb-6">
                  Manage Blogs
                </h2>

                <form
                  onSubmit={editingBlog ? handleUpdateBlog : handleAddBlog}
                  className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-100 mb-8"
                >
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 border-slate-100">
                    {editingBlog ? "Edit Blog Post" : "Create New Post"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                      {/* Title Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                          Blog Title
                          <span className="text-indigo-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                          <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm placeholder:text-slate-400 outline-none transition-all duration-300 ease-in-out hover:border-slate-300 hover:bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            required
                            placeholder="e.g. 10 Tips for Better React Code"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Cover Image URL Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                        Cover Image URL
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm placeholder:text-slate-400 outline-none transition-all duration-300 ease-in-out hover:border-slate-300 hover:bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    {/* =================================== */}
                    <div className="md:col-span-2 border border-slate-200 bg-white rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
                      {/* Row 1: Category Input Group */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            Category
                            <span className="text-indigo-500">*</span>
                          </label>
                          <p className="text-xs text-slate-500 ml-6">
                            Select the primary topic for this blog post.
                          </p>
                        </div>

                        {/* Select Dropdown */}
                        <div className="relative group w-full sm:w-64 shrink-0">
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg pl-3 pr-10 py-2.5 text-sm shadow-sm outline-none transition-all duration-300 ease-in-out hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none cursor-pointer"
                            required
                          >
                            <option value="" disabled>
                              Choose a category...
                            </option>
                            {BLOG_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 group-hover:text-slate-800 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Copyright Toggle Group */}
                      <label className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            Enable Copyright Protection
                          </div>
                          <p className="text-xs text-slate-500 ml-6">
                            Automatically append a copyright notice to the
                            footer of this blog.
                          </p>
                        </div>

                        {/* Custom Tailwind Toggle */}
                        <div className="relative inline-flex items-center shrink-0 self-start sm:self-auto ml-6 sm:ml-0">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={newHasCopyright}
                            onChange={(e) =>
                              setNewHasCopyright(e.target.checked)
                            }
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-indigo-500"></div>
                        </div>
                      </label>
                    </div>
                    {/* ============================= */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[120px]"
                        required
                        placeholder="Write your content here..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editingBlog ? "Save Changes" : "Publish Blog"}
                    </Button>
                  </div>
                </form>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 sm:p-5">
                  <h3 className="text-lg font-semibold text-slate-800 p-4 sm:p-0 sm:mb-4">
                    Published Posts
                  </h3>
                  {/* search + filter controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 px-4 sm:px-0">
                    <div className="relative w-full sm:w-1/3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        className="pl-10 pr-4 h-10 w-full rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  {blogLoading ? (
                    <div className="py-12 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {blogs.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                          No blog posts found.
                        </div>
                      ) : (
                        blogs.map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
                          >
                            {b.imageUrl && (
                              <img
                                src={b.imageUrl}
                                alt="cover"
                                className="w-20 h-20 object-cover rounded-md mr-4"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800 truncate">
                                {b.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {b.category} &middot;{" "}
                                {new Date(b.createdAt).toLocaleDateString()}
                                {b.hasCopyright && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Copyright
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingBlog(b);
                                  setNewTitle(b.title);
                                  setNewContent(b.content);
                                  setNewImageUrl(b.imageUrl || "");
                                  setNewCategory(b.category || "General");
                                  setNewHasCopyright(b.hasCopyright || false);
                                }}
                                className="p-1 hover:bg-slate-100 rounded"
                              >
                                <Edit className="w-5 h-5 text-slate-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(b.id!)}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* pagination */}
                  {filteredBlogs.length > BLOG_PAGE_SIZE && (
                    <div className="flex justify-between items-center mt-4 px-4 sm:px-0">
                      <button
                        disabled={blogPage === 1}
                        onClick={() => setBlogPage((p) => p - 1)}
                        className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600">
                        Page {blogPage} of {totalBlogPages}
                      </span>
                      <button
                        disabled={blogPage === totalBlogPages}
                        onClick={() => setBlogPage((p) => p + 1)}
                        className="px-3 py-1 rounded bg-slate-100 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <div className="flex flex-col md:flex-row h-full">
                {/* left list pane */}
                <div
                  className={`w-full md:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col ${
                    selectedMessage ? "hidden md:flex" : ""
                  }`}
                >
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {messageLoading ? (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Loading messages...
                      </div>
                    ) : (
                      (() => {
                        const filtered = messages
                          .filter((m) =>
                            [m.name, m.email]
                              .join(" ")
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                          )
                          .sort(
                            (a, b) =>
                              (b.createdAt?.seconds || b.createdAt || 0) -
                              (a.createdAt?.seconds || a.createdAt || 0),
                          );

                        const CATEGORY_COLOR: Record<string, string> = {
                          IT: "bg-blue-500",
                          Politics: "bg-red-500",
                          Warfare: "bg-yellow-500",
                          General: "bg-green-500",
                          Other: "bg-gray-400",
                        };

                        if (filtered.length === 0) {
                          return (
                            <div className="p-4 text-center text-sm text-slate-500">
                              No messages found.
                            </div>
                          );
                        }

                        return (
                          <ul className="divide-y divide-slate-200">
                            {filtered.map((m) => (
                              <li
                                key={m.id}
                                className="flex justify-between items-start p-4 hover:bg-slate-100 cursor-pointer"
                                onClick={() => setSelectedMessage(m)}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`${
                                      CATEGORY_COLOR[m.category || "Other"]
                                    } w-2 h-2 rounded-full mt-1`}
                                  />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {m.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                      {m.message.slice(0, 50)}
                                      {m.message.length > 50 && "..."}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-xs text-slate-400">
                                  {m.createdAt
                                    ? new Date(
                                        m.createdAt.seconds
                                          ? m.createdAt.seconds * 1000
                                          : m.createdAt,
                                      ).toLocaleString()
                                    : "-"}
                                </div>
                              </li>
                            ))}
                          </ul>
                        );
                      })()
                    )}
                  </div>
                </div>

                {/* right detail pane */}
                <div
                  className={`flex-1 w-full relative ${
                    !selectedMessage ? "hidden md:flex" : ""
                  }`}
                >
                  {selectedMessage ? (
                    <div className="flex flex-col h-full bg-white">
                      <div className="p-6 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {/* back button on mobile */}
                          <button
                            className="md:hidden p-1 text-slate-500 hover:text-slate-700"
                            onClick={() => setSelectedMessage(null)}
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <h4 className="text-lg font-medium">
                            {selectedMessage.name} &lt;{selectedMessage.email}
                            &gt;
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            if (
                              window.confirm("Delete this message permanently?")
                            ) {
                              if (selectedMessage.id)
                                handleDeleteMessage(selectedMessage.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="px-6">
                        <p className="text-sm text-gray-600">
                          <strong>Category:</strong> {selectedMessage.category}{" "}
                          <br />
                          <strong>Time:</strong>{" "}
                          {selectedMessage.createdAt
                            ? new Date(
                                selectedMessage.createdAt.seconds
                                  ? selectedMessage.createdAt.seconds * 1000
                                  : selectedMessage.createdAt,
                              ).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        <p className="whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>
                      <div className="px-6 py-4 border-t border-slate-200">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold">
                            Reply
                          </label>
                          <textarea
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            rows={4}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const mailto = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                              `Re: ${selectedMessage.category} Inquiry`,
                            )}&body=${encodeURIComponent(replyBody)}`;
                            window.location.href = mailto;
                          }}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4" /> Send via Email
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Mail className="w-12 h-12 mb-4" />
                      <p className="p-2  m-2">
                        Select a message to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="bg-slate-100 text-slate-500 rounded-full p-4 mb-4">
                  <Settings className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Settings
                </h3>
                <p className="text-slate-500 max-w-sm">
                  System configuration and general settings will be available in
                  a future update.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
