import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { NotesModal } from "../../components/NotesModal";
import { technicianGetAssignedRequests } from "../../../services/technicianApi";

function reqId(r: { id?: string; _id?: string }) {
  return r.id ?? (r._id as string) ?? "";
}

export function TechnicianRequestsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notesRequestId, setNotesRequestId] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await technicianGetAssignedRequests();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load assigned requests");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <Card title="Assigned Requests" right={<button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>Refresh</button>}>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>}
      {!loading && !error && items.length === 0 && <div className="text-sm text-slate-400">No assigned requests.</div>}

      <div className="space-y-3">
        {items.map((r) => (
          <div key={reqId(r)} className="rounded-xl border border-slate-800 bg-slate-950/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{r.serviceCode || reqId(r)}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {r.deviceModel} · {r.status}
                  {r.paymentStatus != null && (
                    <span className="ml-2">
                      · Payment: <span className={r.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"}>{r.paymentStatus}</span>
                      {r.paymentAmount != null && ` (${r.paymentAmount})`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                  onClick={() => setNotesRequestId(reqId(r))}
                >
                  Show notes
                </button>
                {r.status !== "completed" && (
                  <>
                    <Link className="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700" to={`/app/technician/resolve/${reqId(r)}`}>
                      Update status
                    </Link>
                    <Link className="text-xs px-2 py-1 rounded-md bg-indigo-700/60 hover:bg-indigo-700" to={`/app/technician/notes/${reqId(r)}`}>
                      Add notes
                    </Link>
                  </>
                )}
                {r.status === "completed" && (
                  <span className="text-xs text-slate-500 italic">No further updates</span>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-300">{r.description}</div>
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


