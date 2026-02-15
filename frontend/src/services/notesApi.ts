import { api } from "./apiClient";

export type Note = {
  id: string;
  requestId: string;
  description: string;
  estimatedCost?: string | null;
  images?: string[];
  createdAt?: string;
};

export async function getNotesForRequest(requestId: string) {
  const res = await api.get(`/api/notes/request/${requestId}`);
  return (res.data ?? []) as Note[];
}

export async function getNotesByServiceCode(serviceCode: string) {
  const res = await api.get("/api/customer/request-notes", {
    params: { serviceCode },
  });
  return (res.data ?? []) as Note[];
}
