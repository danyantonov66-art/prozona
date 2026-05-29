"use client"

import { useState, useEffect } from "react"

interface ExitIntentPopupProps {
  specialistId: string
  specialistName: string
  locale: string
}

export default function ExitIntentPopup({ specialistId, specialistName, locale }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "", phone: "" })

  useEffect(() => {
    if (dismissed) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !dismissed) {
        setShow(true)
      }
    }

    // Само на desktop
    if (window.innerWidth > 768) {
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    // На мобилно — след 30 секунди
    const mobileTimer = window.innerWidth <= 768
      ? setTimeout(() => { if (!dismissed) setShow(true) }, 30000)
      : null

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (mobileTimer) clearTimeout(mobileTimer)
    }
  }, [dismissed])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleDismiss() {
    setShow(false)
    setDismissed(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specialistId,
          city: "Не е посочен",
          categoryId: 1,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setShow(false)
          setDismissed(true)
        }, 2500)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1DB954]/30 bg-[#151528] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">

        {success ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Запитването е изпратено!</h3>
            <p className="text-gray-400 text-sm">{specialistName} ще се свърже с теб скоро.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block bg-[#1DB954]/20 text-[#1DB954] text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  ⏰ Преди да си тръгнеш
                </div>
                <h3 className="text-xl font-bold text-white">Остави запитване към {specialistName}</h3>
                <p className="text-gray-400 text-sm mt-1">Получи безплатна оферта за минути</p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-white text-xl ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3 text-xs text-gray-500 mb-4">
              <span>✅ Безплатно</span>
              <span>✅ Без регистрация</span>
              <span>✅ Отговор до 24 часа</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Вашето ime"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Имейл"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Телефон (незадължително)"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Опишете накратко от какво имате нужда..."
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 resize-none text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black hover:bg-[#1ed760] transition disabled:opacity-60"
              >
                {loading ? "Изпращане..." : "📩 Изпрати запитването безплатно"}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-xs text-gray-500 hover:text-gray-400 py-1"
              >
                Не, благодаря
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}