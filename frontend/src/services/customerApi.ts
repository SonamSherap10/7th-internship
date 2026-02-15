import { api } from "./apiClient";

export type CustomerRequest = {
  id: string;
  serviceCode?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  deviceModel: string;
  description: string;
  categoryId: string;
  status: string;
  technicianId?: string;
  requestedBy?: string;
  createdAt?: string;
};

export async function customerCreateRequestPublic(payload: Record<string, string>) {
  const res = await api.post("/api/customer/addRequest", payload);
  return res.data as { message: string; serviceCode: string };
}

export async function customerCreateRequestForUser(userId: string, payload: Record<string, string>) {
  const res = await api.post(`/api/customer/addRequest/${userId}`, payload);
  return res.data as { message: string; serviceCode: string };
}

export async function customerViewRequests(userId: string) {
  const res = await api.get(`/api/customer/viewRequests/${userId}`);
  const raw = res.data?.requests ?? res.data;
  return (Array.isArray(raw) ? raw : []) as CustomerRequest[];
}

export async function customerViewRequestByCode(serviceCode: string) {
  const res = await api.get("/api/customer/viewRequest", { params: { serviceCode } });
  return res.data as { message: string; data: CustomerRequest[] };
}

export async function customerCancelRequest(requestId: string) {
  const res = await api.get(`/api/customer/cancelRequest/${requestId}`);
  return res.data as { message: string };
}


export async function customerGetCategories() {
  const res = await api.get("/api/customer/categories");
  return (res.data as { id: string; name: string }[]) ?? [];
}


