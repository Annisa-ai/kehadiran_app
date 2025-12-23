"use client"

import { useState } from "react"
// import { createEmployeeByAdmin } from "@/app/actions/admin"
// import { updateEmployee, deleteEmployee } from "@/app/actions/employees"
import {
  createEmployeeByAdmin,
  updateEmployeeByAdmin,
  deleteEmployeeByAdmin,
} from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Employee } from "@/lib/types"
import { useRouter } from "next/navigation"

interface EmployeeManagementProps {
  initialEmployees: Employee[]
}

export default function EmployeeManagement({ initialEmployees }: EmployeeManagementProps) {
  const router = useRouter()
  const [employees, setEmployees] = useState(initialEmployees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    password: "",
  })

  const [editFormData, setEditFormData] = useState({
    name: "",
    position: "",
    department: "",
  })

  const handleAddEmployee = async () => {
    if (!addFormData.name || !addFormData.email || !addFormData.password) {
      setError("Semua field wajib diisi")
      return
    }

    setLoading(true)
    setError("")

    const result = await createEmployeeByAdmin(
    addFormData.email,
    addFormData.password,
    addFormData.name,
    addFormData.position,
    addFormData.department
)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setAddFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      password: "",
    })
    setIsAddDialogOpen(false)
    setLoading(false)
    router.refresh()
  }

  const handleEditEmployee = async () => {
    if (!editingEmployee || !editFormData.name) {
      setError("Nama wajib diisi")
      return
    }

    setLoading(true)
    setError("")

    // const result = await updateEmployee(editingEmployee.id, editFormData)
    const result = await updateEmployeeByAdmin(
      editingEmployee.id,
      editFormData
    )


    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setIsEditDialogOpen(false)
    setEditingEmployee(null)
    setLoading(false)
    router.refresh()
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      return
    }

    const result = await deleteEmployeeByAdmin(id)

    if (result.error) {
      alert("Error: " + result.error)
      return
    }

    router.refresh()
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
    })
    setError("")
    setIsEditDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Karyawan</CardTitle>
            <CardDescription>Kelola informasi dan data karyawan</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Karyawan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                <DialogDescription>Masukkan detail karyawan di bawah ini</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <Input
                    id="department"
                    placeholder="Engineering"
                    value={addFormData.department}
                    onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posisi</Label>
                  <Input
                    id="position"
                    placeholder="Software Developer"
                    value={addFormData.position}
                    onChange={(e) => setAddFormData({ ...addFormData, position: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddEmployee} className="w-full" disabled={loading}>
                  {loading ? "Menambahkan..." : "Tambah Karyawan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <Alert>
            <UserPlus className="h-4 w-4" />
            <AlertDescription>Tidak ada karyawan. Tambahkan karyawan pertama Anda untuk memulai.</AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell className="capitalize">{employee.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(employee)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Karyawan</DialogTitle>
              <DialogDescription>Perbarui detail karyawan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Departemen</Label>
                <Input
                  id="edit-department"
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Posisi</Label>
                <Input
                  id="edit-position"
                  value={editFormData.position}
                  onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                />
              </div>
              <Button onClick={handleEditEmployee} className="w-full" disabled={loading}>
                {loading ? "Menyimpan..." : "Perbarui Karyawan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
