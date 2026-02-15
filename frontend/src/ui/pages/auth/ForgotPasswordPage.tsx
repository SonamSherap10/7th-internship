import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../../services/authApi";

export function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
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
      const res = await forgotPasswordApi(email);
      setMessage(res.message);
      // move to OTP step; keep email in query
      navigate(`/otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Forgot Password</div>
        <div className="text-sm text-slate-400 mt-1">We’ll email you a one-time OTP.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
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

          <button
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Sending..." : "Send OTP"}
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


