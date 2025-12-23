"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, Users, Calendar, Download } from "lucide-react"
import type { Employee, Attendance } from "@/lib/types"

interface AttendanceReportsProps {
  initialEmployees: Employee[]
  initialAttendanceRecords: Attendance[]
}

export default function AttendanceReports({ initialEmployees, initialAttendanceRecords }: AttendanceReportsProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filteredRecords = useMemo(() => {
    let records = initialAttendanceRecords

    if (selectedEmployee !== "all") {
      records = records.filter((r) => r.employee_id === selectedEmployee)
    }

    if (startDate) {
      records = records.filter((r) => r.date >= startDate)
    }

    if (endDate) {
      records = records.filter((r) => r.date <= endDate)
    }

    return records
  }, [initialAttendanceRecords, selectedEmployee, startDate, endDate])

  const stats = useMemo(() => {
    const total = filteredRecords.length
    const hadir = filteredRecords.filter((r) => r.status === "hadir").length
    const terlambat = filteredRecords.filter((r) => r.status === "terlambat").length
    const pulangCepat = filteredRecords.filter((r) => r.status === "pulang_cepat").length

    return { total, hadir, terlambat, pulangCepat }
  }, [filteredRecords])

  const exportReport = () => {
    const csvContent = [
      ["Tanggal", "Nama Karyawan", "Check In", "Check Out", "Jam Kerja", "Status"],
      ...filteredRecords.map((record) => [
        record.date,
        record.employee?.name || "-",
        record.check_in || "-",
        record.check_out || "-",
        record.work_hours ? `${record.work_hours} jam` : "-",
        record.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `laporan-absensi-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Laporan Absensi
          </CardTitle>
          <CardDescription>Buat dan lihat laporan absensi dengan filter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Karyawan</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih karyawan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Karyawan</SelectItem>
                  {initialEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Akhir</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <Button onClick={exportReport} variant="outline" className="w-full md:w-auto bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Laporan (CSV)
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Data</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Data absensi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hadir}</div>
            <p className="text-xs text-muted-foreground mt-1">Tepat waktu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <Users className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.terlambat}</div>
            <p className="text-xs text-muted-foreground mt-1">Check-in terlambat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pulang Cepat</CardTitle>
            <FileText className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pulangCepat}</div>
            <p className="text-xs text-muted-foreground mt-1">Check-out cepat</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Detail</CardTitle>
          <CardDescription>Data absensi terfilter</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
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
                  {filteredRecords.map((record) => (
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data yang sesuai dengan filter yang dipilih
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
