import { api } from "./apiClient";

export async function technicianGetAssignedRequests() {
  const res = await api.get("/api/technician/getRequest");
  return res.data as any[];
}

export async function technicianGetAssignedRequestById(id: string) {
  const res = await api.get(`/api/technician/request/${id}`);
  return res.data as { id: string; status: string; paymentStatus?: string | null; paymentAmount?: number | null; [key: string]: unknown };
}

export async function technicianResolveRequest(id: string, payload: { status: string; estimatedCost?: string }) {
  const res = await api.post(`/api/technician/resolveRequest/${id}`, payload);
  return res.data as { message: string };
}

export async function technicianAddNotes(id: string, form: FormData) {
  const res = await api.post(`/api/technician/addNotes/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as { message: string };
}


