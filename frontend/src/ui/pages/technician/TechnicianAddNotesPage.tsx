import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { technicianGetAssignedRequestById, technicianAddNotes } from "../../../services/technicianApi";

export function TechnicianAddNotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = React.useState<{ status: string; paymentStatus?: string | null; paymentAmount?: number | null } | null | undefined>(undefined);
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState<FileList | null>(null);
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
      const form = new FormData();
      form.append("description", description);
      if (images) {
        Array.from(images).slice(0, 5).forEach((file) => form.append("images", file));
      }
      const res = await technicianAddNotes(id, form);
      setMessage(res.message);
      setTimeout(() => navigate("/app/technician/requests"), 600);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to add notes");
    } finally {
      setLoading(false);
    }
  }

  if (request === undefined && id) {
    return <Card title="Add Notes"><div className="text-sm text-slate-400">Loading…</div></Card>;
  }
  if (request === null) {
    return <Card title="Add Notes"><div className="text-sm text-slate-400">Request not found.</div><Link to="/app/technician/requests" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">← Back to assigned requests</Link></Card>;
  }

  if (request?.status === "completed") {
    return (
      <Card title="Add Notes">
        <div className="text-sm text-slate-300 mb-3">This request is completed. Notes can no longer be added.</div>
        {request.paymentStatus != null && (
          <div className="text-xs text-slate-500 mb-3">Payment: {request.paymentStatus}{request.paymentAmount != null ? ` (${request.paymentAmount})` : ""}</div>
        )}
        <Link to="/app/technician/requests" className="text-sm text-indigo-400 hover:underline">← Back to assigned requests</Link>
      </Card>
    );
  }

  return (
    <Card title="Add Notes">
      {request?.paymentStatus != null && (
        <div className="text-xs text-slate-500 mb-3">Payment status: {request.paymentStatus}{request.paymentAmount != null ? ` · ${request.paymentAmount}` : ""}</div>
      )}
      <form className="space-y-4 max-w-lg" onSubmit={onSubmit}>
        <div>
          <label className="text-sm text-slate-300">Description</label>
          <textarea
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Images (up to 5)</label>
          <input
            className="mt-1 w-full text-sm"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={(e) => setImages(e.target.files)}
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
          {loading ? "Saving..." : "Add Notes"}
        </button>
      </form>
    </Card>
  );
}


