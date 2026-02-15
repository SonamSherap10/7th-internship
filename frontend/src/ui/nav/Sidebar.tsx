import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../state/auth/useAuth";
import { getMyNotifications } from "../../services/notificationApi";

const linkBase =
  "block px-3 py-2 rounded-md text-sm transition-colors border border-transparent";
const linkActive =
  "bg-slate-800/70 text-white border-slate-700";
const linkIdle = "text-slate-300 hover:bg-slate-900/60 hover:text-white";

export function Sidebar() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    function fetchUnread() {
      getMyNotifications(true)
        .then((list) => setUnreadCount(Array.isArray(list) ? list.length : 0))
        .catch(() => setUnreadCount(0));
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    const onFocus = () => fetchUnread();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user]);

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/60">
      <div className="h-16 px-4 flex items-center justify-center border-b border-slate-800">
        <img
          src="/logo.jpeg"
          alt="Repair Management System"
          className="h-10 w-auto object-contain rounded-[9999px] scale-[1.1]"
        />
      </div>

      <nav className="p-3 space-y-1">
        <NavLink
          to="/app"
          end
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
        >
          Overview
        </NavLink>

        {user?.role !== "admin" && (
          <NavLink
            to="/app/notifications"
            className={({ isActive }) => `${linkBase} flex items-center justify-between ${isActive ? linkActive : linkIdle}`}
          >
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </NavLink>
        )}

        <NavLink
          to="/app/reports"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
        >
          Reports & Analytics
        </NavLink>

        {user?.role === "admin" && (
          <div className="pt-3">
            <div className="px-3 pb-2 text-xs uppercase tracking-wider text-slate-500">
              Admin
            </div>
            <div className="space-y-1">
              <NavLink
                to="/app/admin/users"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Users
              </NavLink>
              <NavLink
                to="/app/admin/categories"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Categories
              </NavLink>
              <NavLink
                to="/app/admin/repair-requests"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Repair Requests
              </NavLink>
            </div>
          </div>
        )}

        {user?.role === "user" && (
          <div className="pt-3">
            <div className="px-3 pb-2 text-xs uppercase tracking-wider text-slate-500">
              Customer
            </div>
            <div className="space-y-1">
              <NavLink
                to="/app/customer/new"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Create Request
              </NavLink>
              <NavLink
                to="/app/customer/requests"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                My Requests
              </NavLink>
            </div>
          </div>
        )}

        {user?.role === "technician" && (
          <div className="pt-3">
            <div className="px-3 pb-2 text-xs uppercase tracking-wider text-slate-500">
              Technician
            </div>
            <div className="space-y-1">
              <NavLink
                to="/app/technician/requests"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Assigned Requests
              </NavLink>
            </div>
          </div>
        )}

        {user?.role === "receptionist" && (
          <div className="pt-3">
            <div className="px-3 pb-2 text-xs uppercase tracking-wider text-slate-500">
              Receptionist
            </div>
            <div className="space-y-1">
              <NavLink
                to="/app/receptionist/new-request"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                New Request
              </NavLink>
              <NavLink
                to="/app/receptionist/payments"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                Payments
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}


