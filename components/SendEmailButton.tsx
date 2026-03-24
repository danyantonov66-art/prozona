"use client"

import { useState } from "react"

interface Props {
  email: string
  name: string
  specialistId: string
}

export default function SendEmailButton({ email, name, specialistId }: Props) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendEmail() {
    setSending(true)
    try {
      await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          name,
          type: "complete_profile",
          specialistId,
        })
      })
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={sendEmail}
      disabled={sending}
      className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
        sent
          ? "bg-[#1DB954]/20 text-[#1DB954]"
          : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
      }`}
      title="Изпрати имейл за попълване на профил"
    >
      {sent ? "✅ Изпратен!" : sending ? "..." : "📧 Попълни профил"}
    </button>
  )
}