import React from "react";
import { Card } from "../../components/Card";
import {
  receptionistCreateRequest,
  receptionistGetCustomers,
  receptionistGetTechnicians,
  receptionistGetCategories,
  type ReceptionistUser,
  type ReceptionistCategory,
} from "../../../services/receptionistApi";

function idOf(u: { id?: string; _id?: string }) {
  return u.id ?? (u._id as string) ?? "";
}

export function ReceptionistCreateRequestPage() {
  const [customers, setCustomers] = React.useState<ReceptionistUser[]>([]);
  const [technicians, setTechnicians] = React.useState<ReceptionistUser[]>([]);
  const [categories, setCategories] = React.useState<ReceptionistCategory[]>([]);
  const [customerId, setCustomerId] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deviceModel: "",
    description: "",
    categoryId: "",
    technicianId: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [serviceCode, setServiceCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([
      receptionistGetCustomers(),
      receptionistGetTechnicians(),
      receptionistGetCategories(),
    ]).then(([c, t, cat]) => {
      setCustomers(c);
      setTechnicians(t);
      setCategories(cat);
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    const c = customers.find((x) => idOf(x) === customerId);
    if (c) setForm((p) => ({ ...p, name: c.name, email: c.email, phone: c.phone ?? "" }));
  }, [customerId, customers]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) return;
    setLoading(true);
    setError(null);
    setServiceCode(null);
    try {
      const payload: Record<string, string> = { ...form };
      if (!payload.technicianId) delete payload.technicianId;
      const res = await receptionistCreateRequest(customerId, payload);
      setServiceCode(res.serviceCode ?? "");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Create Request (Receptionist)">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Customer</label>
          <select
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={idOf(c)} value={idOf(c)}>{c.name} – {c.email}</option>
            ))}
          </select>
        </div>

        {(["name", "email", "phone", "address", "deviceModel"] as const).map((key) => (
          <div key={key}>
            <label className="text-sm text-slate-300 capitalize">{key}</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
              value={(form as any)[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              required
            />
          </div>
        ))}
        <div>
          <label className="text-sm text-slate-300">Category</label>
          <select
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={idOf(cat)} value={idOf(cat)}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Assign technician (optional)</label>
          <select
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={form.technicianId}
            onChange={(e) => setForm((p) => ({ ...p, technicianId: e.target.value }))}
          >
            <option value="">None</option>
            {technicians.map((t) => (
              <option key={idOf(t)} value={idOf(t)}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Description</label>
          <textarea
            className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 min-h-[110px]"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            required
          />
        </div>

        {error && (
          <div className="md:col-span-2 text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
            {error}
          </div>
        )}
        {serviceCode && (
          <div className="md:col-span-2 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-md p-2">
            Created successfully. Service code: <span className="font-semibold">{serviceCode}</span>
          </div>
        )}

        <div className="md:col-span-2">
          <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold disabled:opacity-60" disabled={loading} type="submit">
            {loading ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>
    </Card>
  );
}


