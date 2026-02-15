import React from "react";
import { Link } from "react-router-dom";
import { customerViewRequestByCode, type CustomerRequest } from "../../../services/customerApi";
import { NotesModal } from "../../components/NotesModal";

function idOf(r: CustomerRequest & { _id?: string }) {
  return (r as any).id ?? (r as any)._id ?? "";
}

function statusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-emerald-400 bg-emerald-950/40 border-emerald-800";
    case "in-progress":
      return "text-amber-400 bg-amber-950/40 border-amber-800";
    case "cancelled":
      return "text-red-400 bg-red-950/40 border-red-800";
    default:
      return "text-slate-300 bg-slate-800/60 border-slate-700";
  }
}

export function LandingPage() {
  const [serviceCode, setServiceCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<(CustomerRequest & { _id?: string })[] | null>(null);
  const [notesServiceCode, setNotesServiceCode] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = serviceCode.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await customerViewRequestByCode(code);
      const list = res.data ?? [];
      setResults(Array.isArray(list) ? list : [list]);
      if (Array.isArray(list) && list.length === 0) setError("No request found for this service code.");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Service code not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <img
            src="/logo.jpeg"
            alt="Repair Management System"
            className="h-8 w-auto object-contain rounded-[9999px] scale-[1.1]"
          />
          <h1>Repair Management System</h1>
          
          <nav className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero + Search */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-xl text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Track your repair
            </h1>
            <p className="text-slate-400 text-lg">
              Enter your service code below to check the status of your repair request.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              className="flex-1 min-w-0 rounded-lg bg-slate-900/80 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              placeholder="e.g. SRV-XXXXXXXXX"
              value={serviceCode}
              onChange={(e) => setServiceCode(e.target.value)}
              autoCapitalize="characters"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-60 transition-colors shrink-0"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </form>

          {error && (
            <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {results && results.length > 0 && (
            <div className="w-full text-left space-y-4 pt-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Result
              </h2>
              <div className="space-y-3">
                {results.map((r) => (
                  <div
                    key={idOf(r)}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono font-semibold text-white">
                        {r.serviceCode || idOf(r)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor(r.status)}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-slate-500">Device</dt>
                        <dd className="text-slate-200">{r.deviceModel}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Contact</dt>
                        <dd className="text-slate-200">{r.name} · {r.phone}</dd>
                      </div>
                    </dl>
                    {r.description && (
                      <div className="text-sm">
                        <dt className="text-slate-500 mb-0.5">Description</dt>
                        <dd className="text-slate-300">{r.description}</dd>
                      </div>
                    )}
                    <div className="pt-2">
                      <button
                        type="button"
                        className="text-sm px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200"
                        onClick={() => setNotesServiceCode(r.serviceCode ?? null)}
                      >
                        Show notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {notesServiceCode != null && (
            <NotesModal
              serviceCode={notesServiceCode}
              onClose={() => setNotesServiceCode(null)}
              title="Request notes"
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-800/50">
        Use your service code to track your repair. New here?{" "}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
          Create an account
        </Link>
        .
      </footer>
    </div>
  );
}
