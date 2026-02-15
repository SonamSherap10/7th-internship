import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../nav/Sidebar";
import { useAuth } from "../../state/auth/useAuth";
import { updateProfilePhotoApi } from "../../services/authApi";
import type { User } from "../../state/auth/types";

const DEFAULT_AVATAR_SVG = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2364748b"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
);

export function DashboardLayout() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const avatarUrl = user?.image && user.image.trim() !== "" ? user.image : null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    e.target.value = "";
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const { user: updated } = await updateProfilePhotoApi(form);
      updateUser(updated as User);
      setMenuOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="h-full w-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40 backdrop-blur">
          <div className="font-semibold text-slate-100">Repair Service Dashboard</div>
          <div className="flex items-center gap-3 relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full border-2 border-slate-600 bg-slate-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${DEFAULT_AVATAR_SVG})` }}
                  title={user ? `${user.name} (no photo)` : "No profile picture"}
                />
              )}
              <span className="text-sm text-slate-400 hidden sm:inline">
                {user?.name} <span className="text-slate-500">({user?.role})</span>
              </span>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-slate-700 bg-slate-900 shadow-xl z-20 py-1">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Change profile picture"}
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
