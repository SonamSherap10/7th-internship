import React from "react";
import { Card } from "../../components/Card";
import { getMyNotifications, markNotificationRead, type Notification } from "../../../services/notificationApi";

export function NotificationsPage() {
  const [items, setItems] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyNotifications();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onMarkRead(id: string) {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      // ignore
    }
  }

  return (
    <Card
      title="Notifications"
      right={
        <button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>
          Refresh
        </button>
      }
    >
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && (
        <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
          {error}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-slate-400">No notifications.</div>
      )}

      <div className="space-y-2">
        {items.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg border p-3 flex items-start justify-between gap-3 ${
              n.isRead ? "border-slate-800 bg-slate-950/20" : "border-indigo-900/60 bg-indigo-950/20"
            }`}
          >
            <div>
              <div className="text-sm text-slate-100">{n.message}</div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date(n.createdAt).toLocaleString()} • {n.type}
              </div>
            </div>
            {!n.isRead && (
              <button
                className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700"
                onClick={() => onMarkRead(n.id)}
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}


