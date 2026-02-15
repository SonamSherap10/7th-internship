import { api } from "./apiClient";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type Category = { id: string; name: string };

export type RepairRequest = {
  id: string;
  serviceCode?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deviceModel: string;
  description: string;
  categoryId: string;
  technicianId?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  requestedBy?: string;
  createdAt: string;
};

export async function adminGetUsers() {
  const res = await api.get("/api/admin/users");
  return res.data as AdminUser[];
}

export async function adminDeleteUser(userId: string) {
  const res = await api.delete(`/api/admin/deleteUser/${userId}`);
  return res.data as { message: string };
}

export async function adminEditUserRole(userId: string, role: string) {
  const res = await api.put(`/api/admin/editUserRole/${userId}`, { role });
  return res.data as { message: string };
}

export async function adminGetCategories() {
  const res = await api.get("/api/admin/categories");
  return res.data as Category[];
}

export async function adminAddCategory(categoryName: string) {
  const res = await api.post("/api/admin/addCategory", { categoryName });
  return res.data as { message: string };
}

export async function adminDeleteCategory(categoryId: string) {
  const res = await api.delete(`/api/admin/deleteCategory/${categoryId}`);
  return res.data as { message: string };
}

export async function adminGetRepairRequests() {
  const res = await api.get("/api/admin/repairRequests");
  return res.data as RepairRequest[];
}

export async function adminAssignTechnician(requestId: string, technicianId: string) {
  const res = await api.put(`/api/admin/assignTechnician/${requestId}`, { technicianId });
  return res.data as { message: string };
}

export async function adminDeleteRepairRequest(requestId: string) {
  const res = await api.delete(`/api/admin/repairRequests/${requestId}`);
  return res.data as { message: string };
}


