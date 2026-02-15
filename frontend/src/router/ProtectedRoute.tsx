import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";
import type { Role } from "../state/auth/types";
import type React from "react";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactElement;
  allow?: Role[];
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (allow && !allow.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
}


