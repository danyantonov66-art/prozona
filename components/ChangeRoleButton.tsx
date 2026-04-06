"use client"
import { useState } from "react"

interface Props {
  userId: string
  currentRole: string
}

export default function ChangeRoleButton({ userId, currentRole }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (currentRole !== "CLIENT") return null

  async function changeRole() {
    if (!confirm("Смени ролята на този потребител от Клиент на Специалист?")) return
    setLoading(true)
    try {
      await fetch("/api/admin/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      setDone(true)
      setTimeout(() => window.location.reload(), 1000)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={changeRole}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
        done
          ? "bg-[#1DB954]/20 text-[#1DB954]"
          : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
      }`}
    >
      {done ? "✅ Сменено!" : loading ? "..." : "🔧 Смени на Специалист"}
    </button>
  )
}