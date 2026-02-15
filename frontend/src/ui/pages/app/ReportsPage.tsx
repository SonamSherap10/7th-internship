import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAuth } from "../../../state/auth/useAuth";
import { Card } from "../../components/Card";
import { adminGetRepairRequests } from "../../../services/adminApi";
import { customerViewRequests } from "../../../services/customerApi";
import { technicianGetAssignedRequests } from "../../../services/technicianApi";
import { receptionistGetCompletedAwaitingPayment, receptionistUpdatePayment } from "../../../services/receptionistApi";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const PIE_COLORS = ["#64748b", "#f59e0b", "#10b981", "#ef4444"]; // slate, amber, emerald, red

function byStatus<T extends { status: string }>(items: T[]) {
  const m: Record<string, number> = {};
  items.forEach((r) => { m[r.status] = (m[r.status] ?? 0) + 1; });
  return m;
}

function idOf(r: { id?: string; _id?: string }) {
  return r.id ?? (r._id as string) ?? "";
}

export function ReportsPage() {
  const { user } = useAuth();
  const [adminRequests, setAdminRequests] = React.useState<any[]>([]);
  const [myRequests, setMyRequests] = React.useState<any[]>([]);
  const [assignedRequests, setAssignedRequests] = React.useState<any[]>([]);
  const [awaitingPayment, setAwaitingPayment] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        if (user.role === "admin") {
          const data = await adminGetRepairRequests();
          if (!cancelled) setAdminRequests(Array.isArray(data) ? data : []);
        }
        if (user.role === "user") {
          const data = await customerViewRequests(user.id);
          if (!cancelled) setMyRequests(Array.isArray(data) ? data : []);
        }
        if (user.role === "technician" || user.role === "admin") {
          const data = await technicianGetAssignedRequests();
          if (!cancelled) setAssignedRequests(Array.isArray(data) ? data : []);
        }
        if (user.role === "receptionist") {
          const data = await receptionistGetCompletedAwaitingPayment();
          if (!cancelled) setAwaitingPayment(Array.isArray(data) ? data : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  function removeFromAwaiting(id: string) {
    setAwaitingPayment((prev) => prev.filter((r) => idOf(r) !== id));
  }

  if (loading) return <div className="text-sm text-slate-400">Loading…</div>;
  if (error) return <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>;

  // Admin: all requests by status (pie chart)
  if (user?.role === "admin") {
    const counts = byStatus(adminRequests);
    const statusOrder = ["pending", "in-progress", "completed", "cancelled"];
    const pieData = statusOrder.map((status, i) => ({
      name: STATUS_LABELS[status] ?? status,
      value: counts[status] ?? 0,
      color: PIE_COLORS[i],
    })).filter((d) => d.value > 0);

    return (
      <div className="space-y-4">
        <Card title="Reports & Analytics">
          <div className="text-sm text-slate-400 mb-4">Total: {adminRequests.length} repair requests</div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/30 h-80 text-slate-500">
              No data to display
            </div>
          ) : (
            <div className="h-80 w-full max-w-md mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="rgba(15,23,42,0.8)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgb(15 23 42)", border: "1px solid rgb(30 41 59)", borderRadius: "8px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    formatter={(value: number | undefined) => [value ?? 0, "Count"]}
                    labelFormatter={(name) => name}
                  />
                  <Legend
                    formatter={(value) => <span className="text-slate-300">{value}</span>}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Customer: my requests by status
  if (user?.role === "user") {
    const counts = byStatus(myRequests);
    return (
      <div className="space-y-4">
        <Card title="My requests by status">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["pending", "in-progress", "completed", "cancelled"].map((status) => (
              <div key={status} className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs uppercase text-slate-500">{status}</div>
                <div className="text-xl font-bold text-white">{counts[status] ?? 0}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-400">Total: {myRequests.length} requests</div>
        </Card>
      </div>
    );
  }

  // Technician: assigned requests by status (pie chart)
  if (user?.role === "technician") {
    const counts = byStatus(assignedRequests);
    const statusOrder = ["pending", "in-progress", "completed", "cancelled"];
    const pieData = statusOrder.map((status, i) => ({
      name: STATUS_LABELS[status] ?? status,
      value: counts[status] ?? 0,
      color: PIE_COLORS[i],
    })).filter((d) => d.value > 0);

    return (
      <div className="space-y-4">
        <Card title="Reports & Analytics">
          <div className="text-sm text-slate-400 mb-4">Total: {assignedRequests.length} assigned requests</div>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/30 h-80 text-slate-500">
              No data to display
            </div>
          ) : (
            <div className="h-80 w-full max-w-md mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="rgba(15,23,42,0.8)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgb(15 23 42)", border: "1px solid rgb(30 41 59)", borderRadius: "8px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    formatter={(value: number | undefined) => [value ?? 0, "Count"]}
                    labelFormatter={(name) => name}
                  />
                  <Legend
                    formatter={(value) => <span className="text-slate-300">{value}</span>}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Receptionist: completed awaiting payment + quick mark paid
  if (user?.role === "receptionist") {
    return (
      <div className="space-y-4">
        <Card title="Completed requests awaiting payment">
          <div className="text-sm text-slate-400 mb-3">Count: {awaitingPayment.length}</div>
          <div className="space-y-2">
            {awaitingPayment.map((r) => (
              <div key={idOf(r)} className="flex items-center justify-between rounded-lg border border-slate-800 p-3">
                <div>
                  <span className="font-medium text-slate-100">{r.serviceCode ?? idOf(r)}</span>
                  <span className="text-slate-400 ml-2">{r.name} · {r.deviceModel}</span>
                </div>
                <PaymentForm requestId={idOf(r)} onSuccess={() => removeFromAwaiting(idOf(r))} />
              </div>
            ))}
            {awaitingPayment.length === 0 && <div className="text-sm text-slate-500">None</div>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card title="Reports & Analytics">
      <div className="text-sm text-slate-400">No reports for your role.</div>
    </Card>
  );
}

function PaymentForm({ requestId, onSuccess }: { requestId: string; onSuccess: () => void }) {
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function submit(status: "paid" | "pending") {
    const num = Number(amount);
    if (Number.isNaN(num) || num < 0) {
      setErr("Enter a valid amount");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await receptionistUpdatePayment(requestId, { status, amount: num, paymentMethod: "Cash on Delivery" });
      onSuccess();
    } catch (e: unknown) {
      setErr((e as any)?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-24 rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {err && <span className="text-xs text-red-400">{err}</span>}
      <button
        type="button"
        className="text-xs px-2 py-1 rounded-md bg-emerald-700/60 hover:bg-emerald-700 disabled:opacity-60"
        disabled={loading}
        onClick={() => submit("paid")}
      >
        Mark paid
      </button>
    </div>
  );
}
