import App from "@/app"
import CustomerDashboard from "@/pages/customer-dashboard"
import TransactionHistoryPage from "@/pages/history"
import LoginPage from "@/pages/login"
import TransferPage from "@/pages/transfer-page"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "/cs-dashboard", Component: CustomerDashboard },
  { path: "/transfer", Component: TransferPage },
  { path: "/history", Component: TransactionHistoryPage },
  { path: "/login", Component: LoginPage },
])
