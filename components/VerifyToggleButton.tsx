"use client"

export default function VerifyToggleButton({ id, verified }: { id: string; verified: boolean }) {
  async function toggle() {
    const endpoint = verified
      ? `/api/admin/specialists/${id}/unverify`
      : `/api/admin/specialists/${id}/approve`

    await fetch(endpoint, { method: "POST" })
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
        verified
          ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400"
          : "bg-yellow-500/20 text-yellow-400 hover:bg-green-500/20 hover:text-green-400"
      }`}
      title={verified ? "Кликни за де-верифициране" : "Кликни за одобрение"}
    >
      {verified ? "Верифициран" : "Чака"}
    </button>
  )
}