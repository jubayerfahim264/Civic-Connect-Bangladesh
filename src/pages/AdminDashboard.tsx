import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminService } from "@/types/service";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import ServiceTable from "@/components/admin/ServiceTable";
import ServiceForm from "@/components/admin/ServiceForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw } from "lucide-react";

const COLLECTION = "services";

const AdminDashboard = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminService[];
      setServices(data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (service: Omit<AdminService, "id">) => {
    try {
      await addDoc(collection(db, COLLECTION), service);
      toast({ title: "Service added successfully" });
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdate = async (service: Omit<AdminService, "id">) => {
    if (!editingService?.id) return;
    try {
      await updateDoc(doc(db, COLLECTION, editingService.id), service as any);
      toast({ title: "Service updated successfully" });
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteDoc(doc(db, COLLECTION, id));
      toast({ title: "Service deleted" });
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openEdit = (service: AdminService) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const openAdd = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
          </header>

          <main className="flex-1 p-6 bg-background">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-3xl font-bold text-foreground">{services.length}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold text-foreground">
                    {new Set(services.map((s) => s.category)).size}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Total Steps</p>
                  <p className="text-3xl font-bold text-foreground">
                    {services.reduce((sum, s) => sum + s.steps.length, 0)}
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Services</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={fetchServices}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                  <Button size="sm" onClick={openAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Add Service
                  </Button>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <ServiceTable
                  services={services}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <ServiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingService ? handleUpdate : handleAdd}
        initialData={editingService}
      />
    </SidebarProvider>
  );
};

export default AdminDashboard;
