import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/auth/login"
import ProtectedRoute from "./auth/protected-route"
import GuestRoute from "./auth/guest-route"
import RegisterPage from "./pages/auth/register"
import UseAuth from "./hooks/use-auth"
import { getHomePath } from "./lib/auth-route"
import SessionChecking from "./components/shared/session-checking"
import CustomerDashboard from "./layouts/customer-dashboard"
import AdminUserManagementPage from "./layouts/admin-dashboard"

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
            <CustomerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
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
