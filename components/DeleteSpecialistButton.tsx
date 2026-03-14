"use client"

export default function DeleteSpecialistButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Сигурен ли си? Това ще изтрие профила на специалиста безвъзвратно.")) return

    const res = await fetch(`/api/admin/specialists/${id}/delete`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Грешка при изтриване")
      return
    }

    alert("Профилът е изтрит успешно.")
    window.location.reload()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-400 hover:text-red-300 hover:underline"
    >
      Изтрий
    </button>
  )
}