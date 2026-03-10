/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminService } from "@/types/service";

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<AdminService | null>(null);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "services", id), (snap) => {
      if (snap.exists()) {
        setService({ id: snap.id, ...(snap.data() as any) });
      } else {
        setService(null);
      }
    });
    return unsubscribe;
  }, [id]);

  if (!service) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link to="/services" className="text-primary hover:underline">
        ← Back to services
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">{service.title}</h1>
      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="mb-4">{service.description}</p>
      {service.steps && service.steps.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Steps</h2>
          <ol className="list-decimal list-inside space-y-1">
            {service.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
