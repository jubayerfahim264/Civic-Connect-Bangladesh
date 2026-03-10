/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Message {
  id?: string;
  name: string;
  email: string;
  category: string;
  message: string;
  uid?: string;           // optional Firestore auth UID for owner
  city?: string;
  country?: string;
  createdAt?: any; // Firestore Timestamp or number
}
