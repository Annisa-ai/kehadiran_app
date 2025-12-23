"use client"

import { useEffect, useState } from "react"

export default function Clock() {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null // ⛑️ cegah hydration mismatch

  return (
    <>
      <div className="text-4xl font-bold font-mono">{time}</div>
      <div className="text-sm text-muted-foreground">{date}</div>
    </>
  )
}
