"use client"

import type React from "react"
import { useState } from "react"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    position: "",
    department: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const result = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.position,
      formData.department,
    )

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || "Registrasi berhasil!")
      setFormData({ email: "", password: "", name: "", position: "", department: "" })
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
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Daftar Akun Baru</CardTitle>
        <CardDescription className="text-base">Buat akun karyawan untuk sistem absensi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@perusahaan.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posisi/Jabatan</Label>
            <Input
              id="position"
              name="position"
              type="text"
              placeholder="Staff Marketing"
              value={formData.position}
              onChange={handleChange}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
            <Input
              id="department"
              name="department"
              type="text"
              placeholder="Marketing"
              value={formData.department}
              onChange={handleChange}
              required
              className="h-11"
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

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-muted-foreground">Catatan:</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Akun baru akan terdaftar sebagai karyawan. Untuk akses admin, hubungi administrator sistem.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
