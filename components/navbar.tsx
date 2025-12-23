"use client"

import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Clock, LogOut, User } from "lucide-react"
import type { Employee } from "@/lib/types"

interface NavbarProps {
  user: Employee
}

export default function Navbar({ user }: NavbarProps) {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Sistem Absensi</h1>
            <p className="text-xs text-muted-foreground capitalize">
              Portal {user?.role === "admin" ? "Admin" : "Karyawan"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span className="font-medium">{user?.name}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
    </nav>
  )
}
