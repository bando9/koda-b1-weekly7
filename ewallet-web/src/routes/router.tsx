import App from "@/app"
import AdminUserDetailPage from "@/pages/admin/admin-detail-page"
import CustomerDashboard from "@/layouts/customer-dashboard"
import TransactionHistoryPage from "@/pages/customer/transaction-history-page"
import LoginPage from "@/pages/auth/login"
import TransferPage from "@/pages/customer/transfer-page"
import { createBrowserRouter } from "react-router"
import RegisterPage from "@/pages/auth/register"
import AdminDashboard from "@/layouts/admin-dashboard"
import CustomerDetailPage from "@/pages/customer/cs-detail-page"
import TopUpPage from "@/pages/customer/top-up-page"

export const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "/cs-dashboard", Component: CustomerDashboard },
  { path: "/admin-dashboard", Component: AdminDashboard },
  { path: "/transfer", Component: TransferPage },
  { path: "/topup", Component: TopUpPage },
  { path: "/history", Component: TransactionHistoryPage },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  { path: "/admin-user-detail", Component: AdminUserDetailPage },
  { path: "/cs-user-detail", Component: CustomerDetailPage },
])
