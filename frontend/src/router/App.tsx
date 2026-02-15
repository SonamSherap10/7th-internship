import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../ui/layouts/DashboardLayout";
import { LoginPage } from "../ui/pages/auth/LoginPage";
import { RegisterPage } from "../ui/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../ui/pages/auth/ForgotPasswordPage";
import { OtpPage } from "../ui/pages/auth/OtpPage";
import { ResetPasswordPage } from "../ui/pages/auth/ResetPasswordPage";
import { UnauthorizedPage } from "../ui/pages/misc/UnauthorizedPage";
import { NotFoundPage } from "../ui/pages/misc/NotFoundPage";

import { OverviewPage } from "../ui/pages/app/OverviewPage";
import { NotificationsPage } from "../ui/pages/app/NotificationsPage";
import { ReportsPage } from "../ui/pages/app/ReportsPage";

import { AdminUsersPage } from "../ui/pages/admin/AdminUsersPage";
import { AdminCategoriesPage } from "../ui/pages/admin/AdminCategoriesPage";
import { AdminRepairRequestsPage } from "../ui/pages/admin/AdminRepairRequestsPage";

import { CustomerMyRequestsPage } from "../ui/pages/customer/CustomerMyRequestsPage";
import { CustomerCreateRequestPage } from "../ui/pages/customer/CustomerCreateRequestPage";

import { TechnicianRequestsPage } from "../ui/pages/technician/TechnicianRequestsPage";
import { TechnicianAddNotesPage } from "../ui/pages/technician/TechnicianAddNotesPage";
import { TechnicianResolveRequestPage } from "../ui/pages/technician/TechnicianResolveRequestPage";

import { ReceptionistCreateRequestPage } from "../ui/pages/receptionist/ReceptionistCreateRequestPage";
import { ReceptionistPaymentsPage } from "../ui/pages/receptionist/ReceptionistPaymentsPage";
import { LandingPage } from "../ui/pages/landing/LandingPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* Admin */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/repair-requests"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminRepairRequestsPage />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="customer/requests"
          element={
            <ProtectedRoute allow={["user"]}>
              <CustomerMyRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/new"
          element={
            <ProtectedRoute allow={["user"]}>
              <CustomerCreateRequestPage />
            </ProtectedRoute>
          }
        />

        {/* Technician */}
        <Route
          path="technician/requests"
          element={
            <ProtectedRoute allow={["technician", "admin"]}>
              <TechnicianRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="technician/resolve/:id"
          element={
            <ProtectedRoute allow={["technician", "admin"]}>
              <TechnicianResolveRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="technician/notes/:id"
          element={
            <ProtectedRoute allow={["technician", "admin"]}>
              <TechnicianAddNotesPage />
            </ProtectedRoute>
          }
        />

        {/* Receptionist */}
        <Route
          path="receptionist/new-request"
          element={
            <ProtectedRoute allow={["receptionist"]}>
              <ReceptionistCreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="receptionist/payments"
          element={
            <ProtectedRoute allow={["receptionist"]}>
              <ReceptionistPaymentsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


