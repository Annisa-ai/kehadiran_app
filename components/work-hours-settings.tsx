"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface WorkHoursSettingsType {
  id: string
  start_time: string
  end_time: string
  late_threshold_minutes: number
  early_leave_threshold_minutes: number
}

export default function WorkHoursSettings() {
  const supabase = getSupabaseBrowserClient()

  const [settings, setSettings] = useState<WorkHoursSettingsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("work_hours_settings")
      .select("*")
      .single()

    if (!error) setSettings(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from("work_hours_settings")
      .update({
        start_time: settings.start_time,
        end_time: settings.end_time,
        late_threshold_minutes: settings.late_threshold_minutes,
        early_leave_threshold_minutes: settings.early_leave_threshold_minutes,
      })
      .eq("id", settings.id)

    if (error) {
      setMessage("Gagal menyimpan pengaturan")
    } else {
      setMessage("Pengaturan jam kerja berhasil disimpan")
    }

    setSaving(false)
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>
  }

  if (!settings) {
    return <p className="text-sm text-red-500">Pengaturan jam kerja tidak ditemukan</p>
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Pengaturan Jam Kerja</CardTitle>
        <CardDescription>Atur jam masuk, pulang, dan toleransi keterlambatan</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Jam Masuk</Label>
          <Input
            type="time"
            value={settings.start_time}
            onChange={(e) => setSettings({ ...settings, start_time: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Jam Pulang</Label>
          <Input
            type="time"
            value={settings.end_time}
            onChange={(e) => setSettings({ ...settings, end_time: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Toleransi Terlambat (menit)</Label>
          <Input
            type="number"
            min={0}
            value={settings.late_threshold_minutes}
            onChange={(e) =>
              setSettings({
                ...settings,
                late_threshold_minutes: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Toleransi Pulang Awal (menit)</Label>
          <Input
            type="number"
            min={0}
            value={settings.early_leave_threshold_minutes}
            onChange={(e) =>
              setSettings({
                ...settings,
                early_leave_threshold_minutes: Number(e.target.value),
              })
            }
          />
        </div>

        {message && (
          <Alert className="bg-green-50 border-green-200 text-green-900">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </CardContent>
    </Card>
  )
}
