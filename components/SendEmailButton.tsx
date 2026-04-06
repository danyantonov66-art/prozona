"use client"
import { useState } from "react"

interface Props {
  email: string
  name: string
  specialistId?: string
  type?: "complete_profile" | "wrong_role"
}

export default function SendEmailButton({ email, name, specialistId, type = "complete_profile" }: Props) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendEmail() {
    setSending(true)
    try {
      await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, name, type, specialistId }),
      })
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const label = type === "wrong_role" ? "📧 Покани като специалист" : "📧 Попълни профил"

  return (
    <button
      onClick={sendEmail}
      disabled={sending}
      className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
        sent
          ? "bg-[#1DB954]/20 text-[#1DB954]"
          : type === "wrong_role"
          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
          : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
      }`}
    >
      {sent ? "✅ Изпратен!" : sending ? "..." : label}
    </button>
  )
}