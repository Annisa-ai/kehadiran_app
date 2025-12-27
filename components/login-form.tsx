"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coffee, Clock } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn(email, password)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // kalau sukses → redirect otomatis dari server action
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
          <Coffee className="w-8 h-8 text-primary" />
        </div>

        <CardTitle className="text-3xl font-bold">
          Sistem Absensi <span className="text-primary">Four Corners</span>
        </CardTitle>

        <CardDescription className="text-base">
          Masuk untuk memulai shift kerja hari ini 
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Karyawan</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@fourcorners.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Memproses..." : "Masuk Shift"}
          </Button>
        </form>


        <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 text-sm">
          <p className="font-semibold text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Catatan
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Gunakan akun resmi Four Corners Coffee untuk login.
            Jika mengalami kendala, silakan hubungi admin / supervisor.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
