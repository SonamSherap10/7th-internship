import React from "react";
import { Card } from "../../components/Card";
import { NotesModal } from "../../components/NotesModal";
import {
  adminAssignTechnician,
  adminDeleteRepairRequest,
  adminGetRepairRequests,
  adminGetUsers,
  adminGetCategories,
  type AdminUser,
  type RepairRequest,
} from "../../../services/adminApi";

function reqId(r: RepairRequest) {
  return (r as any).id ?? (r as any)._id ?? "";
}

export function AdminRepairRequestsPage() {
  const [requests, setRequests] = React.useState<RepairRequest[]>([]);
  const [techs, setTechs] = React.useState<AdminUser[]>([]);
  const [categoryNames, setCategoryNames] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notesRequestId, setNotesRequestId] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [reqs, users, categories] = await Promise.all([
        adminGetRepairRequests(),
        adminGetUsers(),
        adminGetCategories(),
      ]);
      setRequests(Array.isArray(reqs) ? reqs : []);
      setTechs(users.filter((u) => u.role === "technician"));
      setCategoryNames((categories || []).reduce((acc: Record<string, string>, c: any) => {
        acc[c.id ?? c._id] = c.name;
        return acc;
      }, {}));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load repair requests");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onAssign(requestId: string, technicianId: string) {
    await adminAssignTechnician(requestId, technicianId);
    setRequests((prev) =>
      prev.map((r) => (reqId(r) === requestId ? { ...r, technicianId } : r))
    );
  }

  async function onDelete(requestId: string) {
    if (!confirm("Delete this repair request? This cannot be undone.")) return;
    try {
      await adminDeleteRepairRequest(requestId);
      setRequests((prev) => prev.filter((r) => reqId(r) !== requestId));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete");
    }
  }

  return (
    <Card
      title="Repair Requests"
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
      {!loading && !error && requests.length === 0 && (
        <div className="text-sm text-slate-400">No requests found.</div>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={reqId(r)} className="rounded-xl border border-slate-800 bg-slate-950/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  {r.serviceCode || reqId(r)} • {r.status}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {r.name} • {r.email} • {r.phone}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {r.deviceModel} • Category: {categoryNames[r.categoryId] ?? r.categoryId}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Assign technician</div>
                  <select
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-sm"
                    value={r.technicianId ?? ""}
                    onChange={(e) => onAssign(reqId(r), e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {techs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                  onClick={() => setNotesRequestId(reqId(r))}
                >
                  Show notes
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-800/60"
                  onClick={() => onDelete(reqId(r))}
                >
                  Delete request
                </button>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-300">{r.description}</div>
          </div>
        ))}
      </div>
      {notesRequestId != null && (
        <NotesModal
          requestId={notesRequestId}
          onClose={() => setNotesRequestId(null)}
          title="Request notes"
        />
      )}
    </Card>
  );
}


