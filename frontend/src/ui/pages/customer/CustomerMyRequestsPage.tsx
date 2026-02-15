import React from "react";
import { Card } from "../../components/Card";
import { NotesModal } from "../../components/NotesModal";
import { customerCancelRequest, customerViewRequests, customerViewRequestByCode, type CustomerRequest } from "../../../services/customerApi";
import { useAuth } from "../../../state/auth/useAuth";

function idOf(r: CustomerRequest & { _id?: string }) {
  return (r as any).id ?? (r as any)._id ?? "";
}

export function CustomerMyRequestsPage() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<(CustomerRequest & { _id?: string })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [serviceCode, setServiceCode] = React.useState("");
  const [lookupResult, setLookupResult] = React.useState<(CustomerRequest & { _id?: string })[] | null>(null);
  const [lookupError, setLookupError] = React.useState<string | null>(null);
  const [notesRequestId, setNotesRequestId] = React.useState<string | null>(null);
  const [notesServiceCode, setNotesServiceCode] = React.useState<string | null>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await customerViewRequests(user.id);
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, [user?.id]);

  async function onCancel(id: string) {
    if (!confirm("Cancel this request?")) return;
    try {
      await customerCancelRequest(id);
      setItems((prev) => prev.map((r) => (idOf(r) === id ? { ...r, status: "cancelled" } : r)));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to cancel");
    }
  }

  async function onLookupByCode(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceCode.trim()) return;
    setLookupError(null);
    setLookupResult(null);
    try {
      const res = await customerViewRequestByCode(serviceCode.trim());
      const list = res.data ?? [];
      setLookupResult(Array.isArray(list) ? list : [list]);
    } catch (err: any) {
      setLookupError(err?.response?.data?.message || err?.message || "Not found");
    }
  }

  return (
    <div className="space-y-4">
      <Card title="Track by service code">
        <form className="flex gap-2 flex-wrap items-end" onSubmit={onLookupByCode}>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Service code</label>
            <input
              className="rounded-md bg-slate-900 border border-slate-700 px-3 py-2 w-40"
              value={serviceCode}
              onChange={(e) => setServiceCode(e.target.value)}
              placeholder="e.g. SRV-XXX"
            />
          </div>
          <button type="submit" className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-sm">
            Look up
          </button>
        </form>
        {lookupError && <div className="mt-2 text-sm text-red-300">{lookupError}</div>}
        {lookupResult && lookupResult.length > 0 && (
          <div className="mt-2 space-y-2">
            {lookupResult.map((r) => (
              <div key={idOf(r)} className="rounded-lg border border-slate-700 p-2 text-sm flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="font-medium text-slate-100">{r.serviceCode ?? idOf(r)}</span>
                  <span className="text-slate-400 ml-2">{r.status}</span>
                  <div className="text-slate-500 text-xs mt-1">{r.deviceModel} · {r.description?.slice(0, 60)}…</div>
                </div>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                  onClick={() => setNotesServiceCode(r.serviceCode ?? null)}
                >
                  Show notes
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="My Repair Requests" right={<button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>Refresh</button>}>
        {loading && <div className="text-sm text-slate-400">Loading...</div>}
        {error && <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="text-sm text-slate-400">No requests found.</div>}

        <div className="space-y-3">
          {items.map((r) => (
            <div key={idOf(r)} className="rounded-xl border border-slate-800 bg-slate-950/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{r.serviceCode || idOf(r)}</div>
                  <div className="text-xs text-slate-400 mt-1">{r.deviceModel} · {r.status}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                    onClick={() => setNotesRequestId(idOf(r))}
                  >
                    Show notes
                  </button>
                  {r.status !== "cancelled" && (
                    <button className="text-xs px-2 py-1 rounded-md bg-red-900/40 hover:bg-red-900/60" onClick={() => onCancel(idOf(r))}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-300">{r.description}</div>
            </div>
          ))}
        </div>
      </Card>
      {(notesRequestId != null || notesServiceCode != null) && (
        <NotesModal
          requestId={notesRequestId ?? undefined}
          serviceCode={notesServiceCode ?? undefined}
          onClose={() => { setNotesRequestId(null); setNotesServiceCode(null); }}
          title="Request notes"
        />
      )}
    </div>
  );
}


