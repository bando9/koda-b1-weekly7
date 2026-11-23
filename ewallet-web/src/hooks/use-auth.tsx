import { AuthContext } from "@/context/auth-context"
import { useContext } from "react"

function UseAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error("use Auth harus digunakan didalam AuthProvider")
  }

  return context
}

export default UseAuth
