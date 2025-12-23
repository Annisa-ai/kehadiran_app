"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/* ================= LOGIN ================= */
export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", data.user.id)
    .single()

  if (!employee) {
    await supabase.auth.signOut()
    return { error: "Data karyawan tidak ditemukan" }
  }

  revalidatePath("/", "layout")

  if (employee.role === "admin") {
    redirect("/admin")
  } else {
    redirect("/employee")
  }
}

/* ================= SIGN UP KARYAWAN ================= */
export async function signUp(
  email: string,
  password: string,
  name: string,
  position: string,
  department: string
) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "User tidak terbentuk" }
  }

  const { error: insertError } = await supabase.from("employees").insert({
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

/* ================= SIGN OUT ================= */
export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

/* ================= CURRENT USER ================= */
export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return employee
}

/* ================= CREATE FIRST ADMIN ================= */
export async function createFirstAdmin(
  email: string,
  password: string,
  name: string
) {
  const supabase = await getSupabaseServerClient()

  const { data: existingAdmin } = await supabase
    .from("employees")
    .select("id")
    .eq("role", "admin")
    .maybeSingle()

  if (existingAdmin) {
    return { error: "Admin sudah ada" }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error: error.message }
  if (!data.user) return { error: "User tidak terbentuk" }

  const { error: insertError } = await supabase.from("employees").insert({
    user_id: data.user.id,
    email,
    name,
    position: "Administrator",
    department: "IT",
    role: "admin",
  })

  if (insertError) {
    return { error: insertError.message }
  }

  return { success: true, message: "Admin berhasil dibuat" }
}
