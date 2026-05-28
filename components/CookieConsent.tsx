"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) setVisible(true)
  }, [])

  function acceptAll() {
    localStorage.setItem("cookie-consent", "all")
    setVisible(false)
    // GA4 и Meta Pixel вече са заредени — нищо допълнително не трябва
  }

  function acceptNecessary() {
    localStorage.setItem("cookie-consent", "necessary")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#151528] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              🍪 Използваме бисквитки
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Използваме бисквитки за анализ на трафика (Google Analytics) и маркетинг (Meta Pixel).
              Можеш да приемеш всички или само необходимите.{" "}
              <Link href="/bg/cookies" className="text-[#1DB954] hover:underline">
                Научи повече
              </Link>
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              onClick={acceptNecessary}
              className="rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
            >
              Само необходими
            </button>
            <button
              onClick={acceptAll}
              className="rounded-xl bg-[#1DB954] px-4 py-2 text-xs font-semibold text-black hover:bg-[#1ed760] transition"
            >
              Приеми всички
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}