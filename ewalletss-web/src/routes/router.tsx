import App from "@/_app"
import CustomerDashboard from "@/pages/customer-dashboard"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "/cs-dashboard", Component: CustomerDashboard },
])
