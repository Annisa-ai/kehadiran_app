"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Attendance } from "@/lib/types"

export async function getAttendanceRecords(employeeId?: string, startDate?: string, endDate?: string) {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("attendance")
    .select(
      `
    *,
    employee:employees(*)
  `,
    )
    .order("date", { ascending: false })

  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }

  if (startDate) {
    query = query.gte("date", startDate)
  }

  if (endDate) {
    query = query.lte("date", endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching attendance:", error)
    return []
  }

  return data as Attendance[]
}

export async function checkIn(employeeId: string) {
  const supabase = await getSupabaseServerClient()

  const now = new Date()
  const today = now.toISOString().split("T")[0]

  // Cek apakah sudah check-in hari ini
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("date", today)
    .single()

  if (existing) {
    return { error: "Anda sudah check-in hari ini" }
  }

  // Tentukan status berdasarkan jam
  const hour = now.getHours()
  let status: "hadir" | "terlambat" = "hadir"
  if (hour >= 9) {
    status = "terlambat"
  }

  const { error } = await supabase.from("attendance").insert({
    employee_id: employeeId,
    check_in: now.toISOString(),
    date: today,
    status,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/employee")
  return { success: true }
}

export async function checkOut(employeeId: string) {
  const supabase = await getSupabaseServerClient()

  const now = new Date()
  const today = now.toISOString().split("T")[0]

  // Ambil record check-in hari ini
  const { data: attendance, error: fetchError } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("date", today)
    .single()

  if (fetchError || !attendance) {
    return { error: "Anda belum check-in hari ini" }
  }

  if (attendance.check_out) {
    return { error: "Anda sudah check-out hari ini" }
  }

  // Hitung work hours
  const checkInTime = new Date(attendance.check_in)
  const checkOutTime = now
  const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

  const { error } = await supabase
    .from("attendance")
    .update({
      check_out: now.toISOString(),
      work_hours: Math.round(workHours * 100) / 100,
    })
    .eq("id", attendance.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/employee")
  return { success: true }
}

export async function getTodayAttendance(employeeId: string) {
  const supabase = await getSupabaseServerClient()

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("date", today)
    .single()

  if (error) {
    return null
  }

  return data as Attendance
}
