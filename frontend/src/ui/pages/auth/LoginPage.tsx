import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../services/authApi";
import { useAuth } from "../../../state/auth/useAuth";

export function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.token, data.user);
      navigate("/app");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Login</div>
        <div className="text-sm text-slate-400 mt-1">
          Sign in to manage repair requests.
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:border-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:border-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-white">
              ← Back to home
            </Link>
            <div className="flex gap-4">
              <Link to="/forgot-password" className="text-slate-300 hover:text-white">
                Forgot password?
              </Link>
              <Link to="/register" className="text-slate-300 hover:text-white">
                Create account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


