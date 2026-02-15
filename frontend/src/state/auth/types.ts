export type Role = "admin" | "user" | "receptionist" | "technician";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  image?: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
};


