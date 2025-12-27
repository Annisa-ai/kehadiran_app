"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, LogIn, LogOut, Calendar, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  // 🔥 FIX HYDRATION
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = async () => {
    setLoading(true)
    const result = await checkIn(employee.id)

    if (result?.error) {
      alert(result.error)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  const handleCheckOut = async () => {
    setLoading(true)
    const result = await checkOut(employee.id)

    if (result?.error) {
      alert(result.error)
    } else {
      router.refresh()
    }

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
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const formatCheck = (value: string | null) => {
    if (!value) return "--:--:--"
    return formatTime(new Date(value))
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Sistem Absensi <span className="text-amber-700">Four Corners</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Portal karyawan coffee shop • Presensi cepat & real-time 
        </p>
      </div>

      {/* INFO */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Jam Operasional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTime && (
              <>
                <div className="text-4xl font-bold font-mono">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {formatDate(currentTime)}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil Barista / Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama</span>
              <span className="font-medium">{employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shift / Departemen</span>
              <span className="font-medium">{employee.department || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Posisi</span>
              <span className="font-medium">{employee.position || "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ABSENSI */}
      <Card>
        <CardHeader>
          <CardTitle>Presensi Hari Ini</CardTitle>
          <CardDescription>
            Check in saat mulai shift & check out setelah selesai kerja
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Check In</span>
                {todayAttendance?.check_in && (
                  <Badge className="bg-green-600">Hadir</Badge>
                )}
              </div>
              <div className="text-2xl font-mono font-bold">
                {formatCheck(todayAttendance?.check_in ?? null)}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Check Out</span>
                {todayAttendance?.check_out && (
                  <Badge className="bg-blue-600">Selesai</Badge>
                )}
              </div>
              <div className="text-2xl font-mono font-bold">
                {formatCheck(todayAttendance?.check_out ?? null)}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleCheckIn}
              disabled={!!todayAttendance?.check_in || loading}
              className="flex-1 h-12 bg-amber-700 hover:bg-amber-800"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Memproses..." : "Mulai Shift"}
            </Button>

            <Button
              onClick={handleCheckOut}
              disabled={
                !todayAttendance?.check_in ||
                !!todayAttendance?.check_out ||
                loading
              }
              variant="outline"
              className="flex-1 h-12"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {loading ? "Memproses..." : "Akhiri Shift"}
            </Button>
          </div>

          {!todayAttendance?.check_in && (
            <div className="text-center text-sm text-muted-foreground">
              <Calendar className="inline w-4 h-4 mr-1" />
              Shift hari ini belum dimulai
            </div>
          )}
        </CardContent>
      </Card>

      <AttendanceHistory attendanceHistory={attendanceHistory} />
    </div>
  )
}
