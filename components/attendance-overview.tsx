"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "lucide-react"
import type { Attendance } from "@/lib/types"

interface AttendanceOverviewProps {
  initialAttendanceRecords: Attendance[]
}

export default function AttendanceOverview({ initialAttendanceRecords }: AttendanceOverviewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return <Badge className="bg-green-500">Hadir</Badge>
      case "terlambat":
        return <Badge variant="destructive">Terlambat</Badge>
      case "pulang_cepat":
        return <Badge variant="secondary">Pulang Cepat</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Absensi</CardTitle>
        <CardDescription>Lihat semua riwayat absensi karyawan</CardDescription>
      </CardHeader>
      <CardContent>
        {initialAttendanceRecords.length === 0 ? (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Tidak ada data absensi. Karyawan akan muncul di sini setelah melakukan check in.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Karyawan</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Jam Kerja</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialAttendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                    <TableCell>{record.employee?.name || "-"}</TableCell>
                    <TableCell>{formatTime(record.check_in)}</TableCell>
                    <TableCell>{formatTime(record.check_out)}</TableCell>
                    <TableCell>{record.work_hours ? `${record.work_hours} jam` : "-"}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
