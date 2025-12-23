import { getCurrentUser } from "@/app/actions/auth"
import { getTodayAttendance, getAttendanceRecords } from "@/app/actions/attendance"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import EmployeePortal from "@/components/employee-portal"

export default async function EmployeePage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/")
  }

  if (currentUser.role !== "employee") {
    redirect("/admin")
  }

  const todayAttendance = await getTodayAttendance(currentUser.id)
  const attendanceHistory = await getAttendanceRecords(currentUser.id)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={currentUser} />
      <EmployeePortal employee={currentUser} todayAttendance={todayAttendance} attendanceHistory={attendanceHistory} />
    </div>
  )
}
