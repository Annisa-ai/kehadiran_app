export interface Employee {
  id: string
  user_id: string
  name: string
  email: string
  position: string
  department: string
  role: "admin" | "employee"
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  check_in: string
  check_out: string | null
  date: string
  work_hours: number | null
  status: "hadir" | "terlambat" | "pulang_cepat"
  notes: string | null
  created_at: string
  updated_at: string
  employee?: Employee
}
