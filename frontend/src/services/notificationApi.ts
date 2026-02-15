import { api } from "./apiClient";

export type Notification = {
  id: string;
  requestId: any;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export async function getMyNotifications(onlyUnread?: boolean) {
  const res = await api.get("/api/notifications", {
    params: onlyUnread ? { onlyUnread: "true" } : undefined,
  });
  return res.data as Notification[];
}

export async function markNotificationRead(id: string) {
  const res = await api.patch(`/api/notifications/${id}/read`);
  return res.data as { message: string };
}


