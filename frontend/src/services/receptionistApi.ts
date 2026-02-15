import { api } from "./apiClient";

export type ReceptionistUser = { id?: string; _id?: string; name: string; email: string; phone: string; role: string };
export type ReceptionistCategory = { id?: string; _id?: string; name: string };

export async function receptionistGetCustomers() {
  const res = await api.get("/api/receptionist/customers");
  return (res.data ?? []) as ReceptionistUser[];
}

export async function receptionistGetTechnicians() {
  const res = await api.get("/api/receptionist/technicians");
  return (res.data ?? []) as ReceptionistUser[];
}

export async function receptionistGetCategories() {
  const res = await api.get("/api/receptionist/categories");
  return (res.data ?? []) as ReceptionistCategory[];
}

export async function receptionistCreateRequest(customerId: string, payload: Record<string, string>) {
  const res = await api.post(`/api/receptionist/request/${customerId}`, payload);
  return res.data as { message: string; serviceCode: string; request?: unknown };
}

export async function receptionistGetCompletedAwaitingPayment() {
  const res = await api.get("/api/receptionist/requests/completed-awaiting-payment");
  return res.data as any[];
}

export async function receptionistUpdatePayment(requestId: string, payload: { status: "pending" | "paid"; amount: number; paymentMethod?: string }) {
  const res = await api.post(`/api/receptionist/payment/${requestId}`, payload);
  return res.data as any;
}


