"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Провери дали вече е инсталирано
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Провери дали е затворен преди
    const dismissed = localStorage.getItem("pwa-banner-dismissed")
    if (dismissed) return

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
    if (ios && safari) {
      setIsIOS(true)
      setShowBanner(true)
      return
    }

    // Android/Desktop Chrome
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    })
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setShowBanner(false)
      setDeferredPrompt(null)
    }
  }

  function handleDismiss() {
    setShowBanner(false)
    localStorage.setItem("pwa-banner-dismissed", "1")
  }

  if (!showBanner || isInstalled) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="rounded-2xl border border-[#1DB954]/30 bg-[#151528] p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <img
            src="/icons/icon-72x72.png"
            alt="ProZona"
            className="h-12 w-12 rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm">Инсталирай ProZona</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isIOS
                ? 'Натисни "Сподели" → "Добави към началния екран"'
                : "Добави като приложение на телефона си"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-white text-lg leading-none flex-shrink-0 -mt-0.5"
          >
            ✕
          </button>
        </div>

        {!isIOS && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-xl bg-[#1DB954] py-2 text-sm font-semibold text-black hover:bg-[#1ed760] transition"
            >
              Инсталирай
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Не сега
            </button>
          </div>
        )}
      </div>
    </div>
  )
}