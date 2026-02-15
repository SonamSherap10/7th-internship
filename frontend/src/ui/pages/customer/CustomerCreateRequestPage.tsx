import React from "react";
import { Card } from "../../components/Card";
import { customerCreateRequestForUser, customerGetCategories } from "../../../services/customerApi";
import { useAuth } from "../../../state/auth/useAuth";

type Category = { id: string; name: string };

export function CustomerCreateRequestPage() {
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    deviceModel: "",
    description: "",
    categoryId: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [serviceCode, setServiceCode] = React.useState<string | null>(null);

  React.useEffect(() => {
    customerGetCategories().then(setCategories).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    setServiceCode(null);
    try {
      const res = await customerCreateRequestForUser(user.id, form);
      setServiceCode(res.serviceCode);
      setForm((p) => ({ ...p, address: "", deviceModel: "", description: "", categoryId: "" }));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card title="Create Repair Request">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
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
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
    </div>
  );
}


