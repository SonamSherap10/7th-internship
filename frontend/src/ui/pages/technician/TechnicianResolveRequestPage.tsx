import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { technicianGetAssignedRequestById, technicianResolveRequest } from "../../../services/technicianApi";

export function TechnicianResolveRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = React.useState<{ status: string; paymentStatus?: string | null; paymentAmount?: number | null } | null | undefined>(undefined);
  const [status, setStatus] = React.useState("in-progress");
  const [estimatedCost, setEstimatedCost] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setRequest(undefined);
    technicianGetAssignedRequestById(id)
      .then(setRequest)
      .catch(() => setRequest(null));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await technicianResolveRequest(id, { status, estimatedCost });
      setMessage(res.message);
      setTimeout(() => navigate("/app/technician/requests"), 600);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  if (request === undefined && id) {
    return <Card title="Update Request Status"><div className="text-sm text-slate-400">Loading…</div></Card>;
  }
  if (request === null) {
    return <Card title="Update Request Status"><div className="text-sm text-slate-400">Request not found.</div><Link to="/app/technician/requests" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">← Back to assigned requests</Link></Card>;
  }

  if (request?.status === "completed") {
    return (
      <Card title="Update Request Status">
        <div className="text-sm text-slate-300 mb-3">This request is completed and can no longer be updated.</div>
        {request.paymentStatus != null && (
          <div className="text-xs text-slate-500 mb-3">Payment: {request.paymentStatus}{request.paymentAmount != null ? ` (${request.paymentAmount})` : ""}</div>
        )}
        <Link to="/app/technician/requests" className="text-sm text-indigo-400 hover:underline">← Back to assigned requests</Link>
      </Card>
    );
  }

  return (
    <Card title="Update Request Status">
      {request?.paymentStatus != null && (
        <div className="text-xs text-slate-500 mb-3">Payment status: {request.paymentStatus}{request.paymentAmount != null ? ` · ${request.paymentAmount}` : ""}</div>
      )}
      <form className="space-y-4 max-w-lg" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-slate-300">Status</label>
          <select
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="in-progress">in-progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <div className="text-xs text-slate-500 mt-1">
            Backend disallows setting status back to <span className="text-slate-300">pending</span>.
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">Estimated cost (optional)</label>
          <input
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="e.g. 1500"
          />
        </div>

        {error && (
          <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
            {error}
          </div>
        )}
        {message && (
          <div className="text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-md p-2">
            {message}
          </div>
        )}

        <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </Card>
  );
}


