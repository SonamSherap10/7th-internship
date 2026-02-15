import React from "react";
import { Card } from "../../components/Card";
import { NotesModal } from "../../components/NotesModal";
import { receptionistGetCompletedAwaitingPayment, receptionistUpdatePayment } from "../../../services/receptionistApi";

function idOf(r: { id?: string; _id?: string }) {
  return r.id ?? (r._id as string) ?? "";
}

export function ReceptionistPaymentsPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notesRequestId, setNotesRequestId] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await receptionistGetCompletedAwaitingPayment();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load completed requests");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onUpdatePayment(requestId: string, status: "pending" | "paid", amount: number) {
    try {
      await receptionistUpdatePayment(requestId, { status, amount, paymentMethod: "Cash on Delivery" });
      setItems((prev) => prev.filter((r) => idOf(r) !== requestId));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Update failed");
    }
  }

  return (
    <Card title="Payments (Completed requests awaiting payment)" right={<button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>Refresh</button>}>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>}
      {!loading && !error && items.length === 0 && <div className="text-sm text-slate-400">No requests awaiting payment.</div>}

      <div className="space-y-3">
        {items.map((r) => (
          <PaymentRow
            key={idOf(r)}
            request={r}
            onUpdate={(status, amount) => onUpdatePayment(idOf(r), status, amount)}
            onShowNotes={() => setNotesRequestId(idOf(r))}
          />
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

function PaymentRow({ request: r, onUpdate, onShowNotes }: { request: any; onUpdate: (status: "pending" | "paid", amount: number) => void; onShowNotes: () => void }) {
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  function submit(status: "pending" | "paid") {
    const num = Number(amount);
    if (Number.isNaN(num) || num < 0) {
      setErr("Enter a valid amount");
      return;
    }
    setLoading(true);
    setErr(null);
    onUpdate(status, num);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{r.serviceCode || idOf(r)}</div>
          <div className="text-xs text-slate-400 mt-1">{r.name} · {r.phone} · {r.status}</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="text-xs px-2 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
            onClick={onShowNotes}
          >
            Show notes
          </button>
          <input
            type="number"
            className="w-28 rounded-md bg-slate-900 border border-slate-700 px-2 py-1.5 text-sm"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {err && <span className="text-xs text-red-400">{err}</span>}
          <button
            type="button"
            className="text-xs px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700"
            disabled={loading}
            onClick={() => submit("pending")}
          >
            Mark Pending
          </button>
          <button
            type="button"
            className="text-xs px-2 py-1.5 rounded-md bg-emerald-700/60 hover:bg-emerald-700"
            disabled={loading}
            onClick={() => submit("paid")}
          >
            Mark Paid
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-300">{r.description}</div>
    </div>
  );
}


