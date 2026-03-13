"use client"

export default function ApproveButton({ id }: { id: string }) {
  async function approve() {
    await fetch(`/api/admin/specialists/${id}/approve`, { method: "POST" })
    window.location.reload()
  }

  return (
    <button
      onClick={approve}
      className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-500/40 transition"
    >
      Одобри
    </button>
  )
}