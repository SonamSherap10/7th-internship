import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <div className="text-xl font-bold text-white">Unauthorized</div>
        <div className="text-sm text-slate-400 mt-1">
          You don’t have permission to access that page.
        </div>
        <div className="mt-4">
          <Link to="/app" className="text-white hover:underline text-sm">
            Go back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


