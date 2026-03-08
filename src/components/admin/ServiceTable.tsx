import { AdminService } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface ServiceTableProps {
  services: AdminService[];
  onEdit: (service: AdminService) => void;
  onDelete: (id: string) => void;
}

const ServiceTable = ({ services, onEdit, onDelete }: ServiceTableProps) => {
  if (services.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No services found</p>
        <p className="text-sm">Click "Add Service" to create your first entry.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Description</TableHead>
            <TableHead className="font-semibold text-center">Steps</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} className="hover:bg-muted/30">
              <TableCell className="font-medium text-foreground">{service.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{service.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                {service.description}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{service.steps.length}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(service)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(service.id!)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTable;
