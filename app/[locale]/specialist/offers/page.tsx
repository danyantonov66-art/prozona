"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OffersGeneratorPage() {
  const { status } = useSession()
  const router = useRouter()

  const [clientName, setClientName] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [materials, setMaterials] = useState("")
  const [estimatedPrice, setEstimatedPrice] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [warrantyMonths, setWarrantyMonths] = useState("")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [premiumRequired, setPremiumRequired] = useState(false)
  const [offer, setOffer] = useState("")
  const [copied, setCopied] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  async function generateOffer() {
    setError("")
    setPremiumRequired(false)
    setOffer("")

    if (serviceDescription.trim().length < 5) {
      setError("Опиши накратко каква услуга предлагаш.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/specialist/offers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          serviceDescription,
          materials,
          estimatedPrice,
          durationDays,
          warrantyMonths,
          notes,
        }),
      })
      const data = await res.json()

      if (res.status === 403 && data.error === "PREMIUM_REQUIRED") {
        setPremiumRequired(true)
        return
      }
      if (!res.ok) {
        setError(data.error || "Възникна грешка. Опитай отново.")
        return
      }
      setOffer(data.offer)
    } catch {
      setError("Възникна грешка с връзката. Опитай отново.")
    } finally {
      setLoading(false)
    }
  }

  function copyOffer() {
    navigator.clipboard.writeText(offer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function downloadPdf() {
    setPdfLoading(true)
    try {
      const res = await fetch("/api/specialist/offers/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, clientName }),
      })
      if (!res.ok) throw new Error("PDF error")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `oferta-${clientName || "klient"}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setError("Грешка при генериране на PDF. Опитай отново.")
    } finally {
      setPdfLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white flex items-center justify-center">
        <p className="text-gray-400">Зареждане...</p>
      </main>
    )
  }

  if (status === "unauthenticated") {
    router.push("/bg/login")
    return null
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">📋 Генератор на оферти</h1>
            <p className="text-sm text-gray-400 mt-1">
              Опиши работата — получаваш готова професионална оферта за 30 секунди.
            </p>
          </div>
          <Link
            href="/bg/specialist/dashboard"
            className="text-sm text-gray-400 hover:text-white whitespace-nowrap"
          >
            ← Назад
          </Link>
        </div>

        {premiumRequired && (
          <div className="rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-6 mb-8 text-center">
            <p className="text-lg font-semibold mb-2">🔒 Само за Premium специалисти</p>
            <p className="text-sm text-gray-300 mb-4">
              Генераторът на оферти е достъпен с Premium план. Първите 200 регистрирани получават Premium безплатно за 6 месеца.
            </p>
            <Link
              href="/bg/specialist/buy-credits"
              className="inline-block rounded-xl bg-[#1DB954] px-5 py-2 text-sm font-semibold text-black hover:bg-[#1ed760]"
            >
              Виж Premium плана
            </Link>
          </div>
        )}

        {!premiumRequired && !offer && (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Име на клиент (по желание)</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="напр. Иван Петров"
                className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Описание на работата <span className="text-red-400">*</span>
              </label>
              <textarea
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="напр. Подмяна на ВиК инсталация в баня, 2 крана и казанче"
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Материали</label>
                <input
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="напр. тръби, фитинги"
                  className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Приблизителна цена</label>
                <input
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  placeholder="напр. 250-300 лв."
                  className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Срок (дни)</label>
                <input
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="напр. 2"
                  className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Гаранция (месеци)</label>
                <input
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(e.target.value)}
                  placeholder="напр. 12"
                  className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Допълнителни бележки</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="по желание"
                className="w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={generateOffer}
              disabled={loading}
              className="w-full rounded-xl bg-[#1DB954] px-4 py-3 text-sm font-semibold text-black hover:bg-[#1ed760] transition disabled:opacity-50"
            >
              {loading ? "Генерира се..." : "✨ Генерирай оферта"}
            </button>
          </div>
        )}

        {offer && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-200 font-sans leading-relaxed">{offer}</pre>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyOffer}
                className="rounded-xl bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760] transition"
              >
                {copied ? "✅ Копирано!" : "📋 Копирай текста"}
              </button>
              <button
                onClick={downloadPdf}
                disabled={pdfLoading}
                className="rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-sm font-semibold text-white hover:border-[#1DB954]/40 transition disabled:opacity-50"
              >
                {pdfLoading ? "Генерира се..." : "⬇️ Свали PDF"}
              </button>
              <button
                onClick={() => setOffer("")}
                className="rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-2 text-sm font-semibold text-gray-300 hover:border-white/30 transition"
              >
                ↻ Нова оферта
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}