export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin"; // backend uses role
  isAdmin?: boolean;      // optional, in case older code checks this
  token?: string;         // if stored in localStorage after login
  createdAt?: string;
  updatedAt?: string;
}