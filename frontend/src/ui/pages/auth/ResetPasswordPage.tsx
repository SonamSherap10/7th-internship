import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../../../services/authApi";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const presetEmail = params.get("email") || "";
  const [email, setEmail] = React.useState(presetEmail);
  const [newpassword, setNewPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await resetPasswordApi(email, newpassword, confirmpassword);
      setMessage(res.message);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Reset Password</div>
        <div className="text-sm text-slate-400 mt-1">Set a new password for your account.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">New password</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} type="password" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Confirm password</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required />
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

          <button className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold disabled:opacity-60" disabled={loading} type="submit">
            {loading ? "Saving..." : "Reset Password"}
          </button>

          <div className="text-sm text-slate-300">
            <Link to="/login" className="text-white hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


