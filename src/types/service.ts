export interface AdminService {
  id?: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;           // optional URL for a card image
  steps: string[];
  createdAt?: number;
  updatedAt?: number;
}

export const SERVICE_CATEGORIES = [
  "Government",
  "Legal",
  "Education",
  "Health",
  "Transport",
  "Finance",
  "Property",
  "Social Services",
] as const;
