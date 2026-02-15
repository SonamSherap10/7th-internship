import React from "react";
import { Card } from "../../components/Card";
import { adminAddCategory, adminDeleteCategory, adminGetCategories, type Category } from "../../../services/adminApi";

export function AdminCategoriesPage() {
  const [items, setItems] = React.useState<Category[]>([]);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetCategories();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await adminAddCategory(name.trim());
    setName("");
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await adminDeleteCategory(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <Card title="Add category">
        <form className="flex gap-2" onSubmit={onAdd}>
          <input
            className="flex-1 rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
          />
          <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold" type="submit">
            Add
          </button>
        </form>
      </Card>

      <Card title="Categories" right={<button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>Refresh</button>}>
        {loading && <div className="text-sm text-slate-400">Loading...</div>}
        {error && <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="text-sm text-slate-400">No categories found.</div>}

        <div className="space-y-2">
          {items.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/20 p-3">
              <div className="text-sm text-slate-100">{c.name}</div>
              <button className="text-xs px-2 py-1 rounded-md bg-red-900/40 hover:bg-red-900/60" onClick={() => onDelete(c.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


