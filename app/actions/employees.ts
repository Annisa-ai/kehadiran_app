"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Employee } from "@/lib/types"

export async function getEmployees() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching employees:", error)
    return []
  }

  return data as Employee[]
}

export async function getEmployeeById(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

  if (error) {
    return null
  }

  return data as Employee
}

export async function createEmployee(formData: {
  name: string
  email: string
  position: string
  department: string
  password: string
}) {
  const supabase = await getSupabaseServerClient()

  // Buat user di auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Gagal membuat user" }
  }

  // Insert data employee
  const { error: insertError } = await supabase.from("employees").insert({
    user_id: authData.user.id,
    name: formData.name,
    email: formData.email,
    position: formData.position,
    department: formData.department,
    role: "employee",
  })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateEmployee(id: string, formData: { name: string; position: string; department: string }) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("employees")
    .update({
      name: formData.name,
      position: formData.position,
      department: formData.department,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteEmployee(id: string) {
  const supabase = await getSupabaseServerClient()

  // Ambil user_id dulu
  const { data: employee } = await supabase.from("employees").select("user_id").eq("id", id).single()

  if (!employee) {
    return { error: "Karyawan tidak ditemukan" }
  }

  // Delete employee (akan cascade delete attendance records)
  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  // Delete dari auth (opsional, bisa skip jika ingin keep auth user)
  // await supabase.auth.admin.deleteUser(employee.user_id)

  revalidatePath("/admin")
  return { success: true }
}
