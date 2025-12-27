"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, LogIn, LogOut, Calendar, User } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AttendanceHistory from "@/components/attendance-history"

import { checkIn, checkOut } from "@/app/actions/attendance"
import type { Employee, Attendance } from "@/lib/types"

interface EmployeePortalProps {
  employee: Employee
  todayAttendance: Attendance | null
  attendanceHistory: Attendance[]
}

export default function EmployeePortal({
  employee,
  todayAttendance,
  attendanceHistory,
}: EmployeePortalProps) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = async () => {
    setLoading(true)
    const result = await checkIn(employee.id)
    if (result?.error) alert(result.error)
    else router.refresh()
    setLoading(false)
  }

  const handleCheckOut = async () => {
    setLoading(true)
    const result = await checkOut(employee.id)
    if (result?.error) alert(result.error)
    else router.refresh()
    setLoading(false)
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const formatCheck = (value: string | null) =>
    value ? formatTime(new Date(value)) : "--:--:--"

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          Sistem Absensi <span className="text-amber-700">Four Corners</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Portal karyawan • Presensi cepat & real-time
        </p>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Jam Operasional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTime && (
              <>
                <div className="text-3xl md:text-4xl font-mono font-bold">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">
                  {formatDate(currentTime)}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              Profil Karyawan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <InfoRow label="Nama" value={employee.name} />
            <InfoRow label="Shift" value={employee.department || "-"} />
            <InfoRow label="Posisi" value={employee.position || "-"} />
          </CardContent>
        </Card>
      </div>

      {/* ABSENSI */}
      <Card>
        <CardHeader>
          <CardTitle>Presensi Hari Ini</CardTitle>
          <CardDescription className="text-sm">
            Check in & check out sesuai jam kerja
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* STATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AttendanceBox
              label="Check In"
              time={formatCheck(todayAttendance?.check_in ?? null)}
              badge={todayAttendance?.check_in && "Hadir"}
              badgeColor="bg-green-600"
            />
            <AttendanceBox
              label="Check Out"
              time={formatCheck(todayAttendance?.check_out ?? null)}
              badge={todayAttendance?.check_out && "Selesai"}
              badgeColor="bg-blue-600"
            />
          </div>

          {/* BUTTON */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCheckIn}
              disabled={!!todayAttendance?.check_in || loading}
              className="h-12 w-full bg-amber-700 hover:bg-amber-800"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Mulai Shift
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={
                !todayAttendance?.check_in ||
                !!todayAttendance?.check_out ||
                loading
              }
              variant="outline"
              className="h-12 w-full"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Akhiri Shift
            </Button>
          </div>

          {!todayAttendance?.check_in && (
            <p className="text-center text-xs text-muted-foreground">
              <Calendar className="inline w-4 h-4 mr-1" />
              Shift hari ini belum dimulai
            </p>
          )}
        </CardContent>
      </Card>

      <AttendanceHistory attendanceHistory={attendanceHistory} />
    </div>
  )
}

/* 🔧 KOMPONEN BANTUAN */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function AttendanceBox({
  label,
  time,
  badge,
  badgeColor,
}: {
  label: string
  time: string
  badge?: string
  badgeColor?: string
}) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {badge && <Badge className={badgeColor}>{badge}</Badge>}
      </div>
      <div className="text-xl font-mono font-bold">{time}</div>
    </div>
  )
}
