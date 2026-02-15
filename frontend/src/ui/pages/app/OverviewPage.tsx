import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../state/auth/useAuth";
import { Card } from "../../components/Card";
import { adminGetUsers, adminGetCategories, adminGetRepairRequests } from "../../../services/adminApi";
import { customerViewRequests } from "../../../services/customerApi";
import { technicianGetAssignedRequests } from "../../../services/technicianApi";
import { receptionistGetCompletedAwaitingPayment } from "../../../services/receptionistApi";

type Stats = { users?: number; categories?: number; requests?: number; myRequests?: number; assigned?: number; awaitingPayment?: number };

export function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<Stats>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    const role = user.role;
    let cancelled = false;

    async function load() {
      try {
        if (role === "admin") {
          const [users, categories, requests] = await Promise.all([
            adminGetUsers(),
            adminGetCategories(),
            adminGetRepairRequests(),
          ]);
          if (!cancelled) setStats({ users: users.length, categories: categories.length, requests: requests.length });
        } else if (role === "user") {
          const requests = await customerViewRequests(user.id);
          if (!cancelled) setStats({ myRequests: requests.length });
        } else if (role === "technician") {
          const assigned = await technicianGetAssignedRequests();
          if (!cancelled) setStats({ assigned: assigned.length });
        }
        if (role === "receptionist") {
          const list = await receptionistGetCompletedAwaitingPayment();
          if (!cancelled) setStats({ awaitingPayment: list.length });
        }
      } catch {
        if (!cancelled) setStats({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id, user?.role]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold text-white">Welcome, {user?.name}</div>
        <div className="text-sm text-slate-400 mt-1">
          Role: <span className="text-slate-200">{user?.role}</span>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-400">Loading…</div>}

      {!loading && user?.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Users">
            <div className="text-2xl font-bold text-white">{stats.users ?? 0}</div>
            <Link to="/app/admin/users" className="text-sm text-indigo-400 hover:underline mt-1 block">Manage users</Link>
          </Card>
          <Card title="Categories">
            <div className="text-2xl font-bold text-white">{stats.categories ?? 0}</div>
            <Link to="/app/admin/categories" className="text-sm text-indigo-400 hover:underline mt-1 block">Manage categories</Link>
          </Card>
          <Card title="Repair requests">
            <div className="text-2xl font-bold text-white">{stats.requests ?? 0}</div>
            <Link to="/app/admin/repair-requests" className="text-sm text-indigo-400 hover:underline mt-1 block">View all</Link>
          </Card>
        </div>
      )}

      {!loading && user?.role === "user" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="My repair requests">
            <div className="text-2xl font-bold text-white">{stats.myRequests ?? 0}</div>
            <Link to="/app/customer/requests" className="text-sm text-indigo-400 hover:underline mt-1 block">View my requests</Link>
          </Card>
          <Card title="New request">
            <Link to="/app/customer/new" className="text-sm text-indigo-400 hover:underline">Create repair request</Link>
          </Card>
        </div>
      )}

      {!loading && user?.role === "technician" && (
        <Card title="Assigned to you">
          <div className="text-2xl font-bold text-white">{stats.assigned ?? 0}</div>
          <Link to="/app/technician/requests" className="text-sm text-indigo-400 hover:underline mt-1 block">View assigned requests</Link>
        </Card>
      )}

      {!loading && user?.role === "receptionist" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Awaiting payment">
            <div className="text-2xl font-bold text-white">{stats.awaitingPayment ?? 0}</div>
            <Link to="/app/receptionist/payments" className="text-sm text-indigo-400 hover:underline mt-1 block">Manage payments</Link>
          </Card>
          <Card title="New request">
            <Link to="/app/receptionist/new-request" className="text-sm text-indigo-400 hover:underline">Create request for customer</Link>
          </Card>
        </div>
      )}
    </div>
  );
}
