import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/auth/login"
import ProtectedRoute from "./auth/protected-route"
import GuestRoute from "./auth/guest-route"
import RegisterPage from "./pages/auth/register"
import UseAuth from "./hooks/use-auth"
import { getHomePath } from "./lib/auth-route"
import SessionChecking from "./components/shared/session-checking"
import AdminUserManagementPage from "./layouts/admin-dashboard"
import CustomerLayout from "./layouts/customer-layout"
import CustomerDashboardPage from "./pages/customer/dashboard"
import TopUpPage from "./pages/customer/top-up-page"
import TransferPage from "./pages/customer/transfer-page"
import ActivitiesPage from "./pages/customer/activities-page"
import SettingsPage from "./pages/customer/setting-page"
import TopUpConfirmPage from "./pages/customer/top-up-confirm-page"
import TopUpSuccessPage from "./pages/customer/top-up-success-page"
import TopUpQrisPage from "./pages/customer/top-up-qris"
import TransferConfirmPage from "./pages/customer/transfer-confirm-page"
import TransferSuccessPage from "./pages/customer/transfer-success-page"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboardPage />} />
        <Route path="top-up" element={<TopUpPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="/dashboard/top-up/confirm"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <TopUpConfirmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/top-up/qris"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <TopUpQrisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/top-up/success"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <TopUpSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/transfer/confirm"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <TransferConfirmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/transfer/success"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <TransferSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUserManagementPage onSelectUser={undefined} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App

function RootRedirect() {
  const { status, user } = UseAuth()
  if (status === "checking") return <SessionChecking />
  return <Navigate to={user ? getHomePath(user.role) : "/login"} replace />
}
