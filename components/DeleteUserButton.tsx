"use client"

export default function DeleteUserButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Сигурен ли си? Това ще изтрие потребителя безвъзвратно.")) return
    const res = await fetch(`/api/admin/users/${id}/delete`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || "Грешка при изтриване")
      return
    }
    alert("Потребителят е изтрит успешно.")
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