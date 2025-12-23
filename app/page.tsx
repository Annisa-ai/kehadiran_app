import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function Home() {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    if (currentUser.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/employee")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <LoginForm />
    </main>
  )
}
