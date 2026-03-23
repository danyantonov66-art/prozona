'use client'

import { useState } from 'react'

interface Props {
  url: string
  title: string
}

export default function ShareButton({ url, title }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Web Share API — работи на мобилни устройства
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {}
    }

    // Fallback — копира линка в клипборда
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Последен fallback за стари браузъри
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1A1A2E] px-4 py-2 text-sm font-medium text-gray-300 hover:border-[#1DB954]/40 hover:text-white transition-colors"
    >
      {copied ? (
        <>
          <span>✅</span>
          <span>Копирано!</span>
        </>
      ) : (
        <>
          <span>🔗</span>
          <span>Сподели</span>
        </>
      )}
    </button>
  )
}