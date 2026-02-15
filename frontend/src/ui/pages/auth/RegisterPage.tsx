import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../../services/authApi";

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("phone", phone);
      form.append("password", password);
      form.append("confirmpassword", confirmpassword);
      if (image) form.append("image", image);

      await registerApi(form);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Register</div>
        <div className="text-sm text-slate-400 mt-1">Create your account.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Phone</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Confirm password</label>
            <input className="mt-1 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required />
          </div>
          <div>
            <label className="text-sm text-slate-300">Profile image (optional)</label>
            <input className="mt-1 w-full text-sm" type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-md p-2">
              {error}
            </div>
          )}

          <button className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 py-2 font-semibold disabled:opacity-60" disabled={loading} type="submit">
            {loading ? "Creating..." : "Register"}
          </button>

          <div className="text-sm text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


