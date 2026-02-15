import React from "react";
import { Card } from "../../components/Card";
import { adminDeleteUser, adminEditUserRole, adminGetUsers, type AdminUser } from "../../../services/adminApi";

export function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    await adminDeleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function onRoleChange(id: string, role: string) {
    await adminEditUserRole(id, role);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  return (
    <Card title="Users" right={<button className="text-sm px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700" onClick={load}>Refresh</button>}>
      {loading && <div className="text-sm text-slate-400">Loading...</div>}
      {error && <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">{error}</div>}
      {!loading && !error && users.length === 0 && <div className="text-sm text-slate-400">No users found.</div>}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-slate-800">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Role</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-900">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.phone}</td>
                  <td className="py-2">
                    <select
                      className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1"
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                      <option value="receptionist">receptionist</option>
                      <option value="technician">technician</option>
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    <button className="text-xs px-2 py-1 rounded-md bg-red-900/40 hover:bg-red-900/60" onClick={() => onDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}


