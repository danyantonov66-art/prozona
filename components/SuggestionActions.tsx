"use client"

import { useState } from "react"

interface Props {
  id: string
}

export default function SuggestionActions({ id }: Props) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING")
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: "APPROVED" | "REJECTED") {
    setLoading(true)
    const res = await fetch(`/api/admin/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) setStatus(newStatus)
    setLoading(false)
  }

  if (status === "APPROVED") return <span className="text-xs text-green-400 font-semibold">✓ Одобрено</span>
  if (status === "REJECTED") return <span className="text-xs text-red-400 font-semibold">✗ Отхвърлено</span>

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateStatus("APPROVED")}
        disabled={loading}
        className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition"
      >
        ✓ Одобри
      </button>
      <button
        onClick={() => updateStatus("REJECTED")}
        disabled={loading}
        className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition"
      >
        ✗ Откажи
      </button>
    </div>
  )
}