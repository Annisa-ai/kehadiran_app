"use client"

import type React from "react"
import { useState } from "react"
import { createFirstAdmin } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SetupAdminForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 TAMBAHAN (UX FEEDBACK)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const result = await createFirstAdmin(
      formData.email,
      formData.password,
      formData.name
    )

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || "Admin berhasil dibuat")
      setIsCompleted(true) // ✅ kunci form
      setFormData({ email: "", password: "", name: "" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <CardTitle className="text-3xl font-bold">
          Setup Admin Pertama
        </CardTitle>
        <CardDescription className="text-base">
          Buat akun admin untuk mengelola sistem absensi
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Admin</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11"
              disabled={loading || isCompleted} // 🔥 TAMBAHAN
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Admin</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@perusahaan.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11"
              disabled={loading || isCompleted} // 🔥 TAMBAHAN
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="h-11"
              disabled={loading || isCompleted} // 🔥 TAMBAHAN
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11"
            disabled={loading || isCompleted} // 🔥 TAMBAHAN
          >
            {loading ? "Memproses..." : "Buat Admin"}
          </Button>

          {/* 🔥 TAMBAHAN UX: TOMBOL LANJUT LOGIN */}
          {isCompleted && (
            <Button asChild className="w-full h-11 mt-2">
              <Link href="">Lanjut ke Login</Link>
            </Button>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-amber-900">Perhatian:</p>
          <p className="text-amber-800 text-xs leading-relaxed">
            Halaman ini hanya untuk setup admin pertama kali. Setelah admin
            dibuat, gunakan halaman login normal.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
