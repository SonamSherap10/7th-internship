import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { otpApi } from "../../../services/authApi";

export function OtpPage() {
  const [params] = useSearchParams();
  const presetEmail = params.get("email") || "";
  const [email, setEmail] = React.useState(presetEmail);
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await otpApi(email, otp);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Verify OTP</div>
        <div className="text-sm text-slate-400 mt-1">Enter the OTP sent to your email.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">OTP</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
              {error}
            </div>
          )}

          <button className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold disabled:opacity-60" disabled={loading} type="submit">
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="text-sm text-slate-300">
            <Link to="/forgot-password" className="text-white hover:underline">
              Resend OTP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


