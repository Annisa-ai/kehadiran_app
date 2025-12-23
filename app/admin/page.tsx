import { getCurrentUser } from "@/app/actions/auth"
import { getEmployees } from "@/app/actions/employees"
import { getAttendanceRecords } from "@/app/actions/attendance"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/")
  }

  if (currentUser.role !== "admin") {
    redirect("/employee")
  }

  const employees = await getEmployees()
  const attendanceRecords = await getAttendanceRecords()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={currentUser} />
      <AdminDashboard initialEmployees={employees} initialAttendanceRecords={attendanceRecords} />
    </div>
  )
}
