"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function createEmployeeByAdmin(
  email: string,
  password: string,
  name: string,
  position: string,
  department: string
) {
  // 1. Buat user auth TANPA LOGIN
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error || !data.user) {
    return { error: error?.message || "Gagal membuat akun auth" }
  }

  // 2. Insert ke tabel employees
  const { error: insertError } = await supabaseAdmin
    .from("employees")
    .insert({
      user_id: data.user.id,
      email,
      name,
      position,
      department,
      role: "employee",
    })

  if (insertError) {
    return { error: insertError.message }
  }

  return { success: true }
}

export async function updateEmployeeByAdmin(
  id: string,
  data: {
    name: string
    position: string
    department: string
  }
) {
  const { error } = await supabaseAdmin
    .from("employees")
    .update(data)
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteEmployeeByAdmin(id: string) {
  // ambil user_id dulu
  const { data: employee, error } = await supabaseAdmin
    .from("employees")
    .select("user_id")
    .eq("id", id)
    .single()

  if (error || !employee) {
    return { error: "Karyawan tidak ditemukan" }
  }

  // hapus auth user
  await supabaseAdmin.auth.admin.deleteUser(employee.user_id)

  // hapus data employee
  const { error: deleteError } = await supabaseAdmin
    .from("employees")
    .delete()
    .eq("id", id)

  if (deleteError) {
    return { error: deleteError.message }
  }

  return { success: true }
}
