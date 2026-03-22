"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Inquiry {
  id: string
  name: string
  city: string
  message: string
  createdAt: string
  categoryId: number
  unlocked?: boolean
  email?: string
  phone?: string
}

export default function SpecialistDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/bg/login")
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/specialist/dashboard")
        .then((r) => r.json())
        .then((data) => {
          setInquiries(data.inquiries || [])
          setCredits(data.credits || 0)
          setLoading(false)
        })
    }
  }, [status])

  async function unlockInquiry(id: string) {
    if (credits < 1) {
      alert("Нямаш достатъчно кредити. Купи кредити за да продължиш.")
      return
    }
    const res = await fetch(`/api/specialist/inquiries/${id}/unlock`, {
      method: "POST"
    })
    const data = await res.json()
    if (res.ok) {
      setCredits((prev) => prev - 1)
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id
            ? { ...inq, unlocked: true, email: data.email, phone: data.phone }
            : inq
        )
      )
    } else {
      alert(data.error || "Грешка")
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white flex items-center justify-center">
        <p className="text-gray-400">Зареждане...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Моят Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-2">
              <span className="text-sm text-gray-400">Кредити: </span>
              <span className="font-bold text-[#1DB954]">{credits}</span>
            </div>
            <Link
              href="/bg/specialist/buy-credits"
              className="rounded-xl bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760]"
            >
              + Купи кредити
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Запитвания</h2>

        {inquiries.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center text-gray-400">
            Все още няма запитвания.
          </div>
        )}

        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl border border-white/10 bg-[#151528] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[#1DB954]">
                      📍 {inq.city}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(inq.createdAt).toLocaleDateString("bg-BG")}
                    </span>
                  </div>

                  {/* Съобщението е винаги видимо */}
                  <p className="text-gray-300 mb-3">{inq.message}</p>

                  {/* Контактите са скрити зад кредит */}
                  {inq.unlocked ? (
                    <div className="rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-4 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-400">Клиент: </span>
                        <span className="font-medium text-white">{inq.name}</span>
                      </p>
                      {inq.email && (
                        <p className="text-sm">
                          <span className="text-gray-400">Имейл: </span>
                          <a href={`mailto:${inq.email}`} className="text-[#1DB954] hover:underline">
                            {inq.email}
                          </a>
                        </p>
                      )}
                      {inq.phone && (
                        <p className="text-sm">
                          <span className="text-gray-400">Телефон: </span>
                          <a href={`tel:${inq.phone}`} className="text-[#1DB954] hover:underline">
                            {inq.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-sm text-gray-500">
                        🔒 Контактите са скрити
                      </div>
                      <button
                        onClick={() => unlockInquiry(inq.id)}
                        className="rounded-xl bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760] transition"
                      >
                        🪙 Отключи за 1 кредит
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}