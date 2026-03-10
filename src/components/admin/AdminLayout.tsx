import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-gray-50/50">
          {/* Outlet is the magic part! It swaps between Dashboard, Services, and Blogs based on the URL */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
