"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History } from "lucide-react"
import type { Attendance } from "@/lib/types"

interface AttendanceHistoryProps {
  attendanceHistory: Attendance[]
}

export default function AttendanceHistory({ attendanceHistory }: AttendanceHistoryProps) {
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
        <CardTitle>Riwayat Absensi</CardTitle>
        <CardDescription>Riwayat absensi Anda beberapa hari terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        {attendanceHistory.length === 0 ? (
          <Alert>
            <History className="h-4 w-4" />
            <AlertDescription>Tidak ada riwayat absensi. Check in untuk mulai melacak absensi Anda.</AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Jam Kerja</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
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
