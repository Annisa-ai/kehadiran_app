"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmployeeManagement from "@/components/employee-management"
import AttendanceOverview from "@/components/attendance-overview"
import AttendanceReports from "@/components/attendance-reports"
import WorkHoursSettings from "@/components/work-hours-settings"
import type { Employee, Attendance } from "@/lib/types"

interface AdminDashboardProps {
  initialEmployees: Employee[]
  initialAttendanceRecords: Attendance[]
}

export default function AdminDashboard({
  initialEmployees,
  initialAttendanceRecords,
}: AdminDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-balance">
          Dashboard Admin
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Kelola karyawan dan monitor absensi
        </p>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        {/* 
          MOBILE FIX:
          - overflow-x-auto → bisa digeser di HP
          - min-w-max → tab tidak kepotong
          - md:grid-cols-4 → tampilan desktop TETAP
        */}
        <div className="overflow-x-auto">
          <TabsList className="grid min-w-max w-full max-w-3xl grid-cols-4 md:grid-cols-4">
            <TabsTrigger value="employees">
              Manajemen Karyawan
            </TabsTrigger>
            <TabsTrigger value="attendance">
              Ringkasan Absensi
            </TabsTrigger>
            <TabsTrigger value="reports">
              Laporan
            </TabsTrigger>
            <TabsTrigger value="work-hours">
              Pengaturan Jam Kerja
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="employees">
          <EmployeeManagement initialEmployees={initialEmployees} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceOverview
            initialAttendanceRecords={initialAttendanceRecords}
          />
        </TabsContent>

        <TabsContent value="reports">
          <AttendanceReports
            initialEmployees={initialEmployees}
            initialAttendanceRecords={initialAttendanceRecords}
          />
        </TabsContent>

        <TabsContent value="work-hours">
          <WorkHoursSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
