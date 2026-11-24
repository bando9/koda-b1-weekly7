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
        {/* topup, transfer, activity, profile */}
      </Route>

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
