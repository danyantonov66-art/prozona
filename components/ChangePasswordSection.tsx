// components/ChangePasswordSection.tsx
//
// Секция "Смяна на парола" за страницата "Редактирай профила" / настройки.
// Клиентски компонент — вмъкни го в профилната страница:
//   import ChangePasswordSection from "@/components/ChangePasswordSection";
//   ... <ChangePasswordSection />
//
// Стилът следва тъмната тема на ProZona (#0D0D1A / #1DB954). Промени класовете,
// ако ползваш друг подход за стилизиране.

"use client";

import { useState } from "react";

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit() {
    setMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: "err", text: "Моля, попълни всички полета." });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: "err", text: "Новата парола трябва да е поне 6 символа." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "Новата парола и потвърждението не съвпадат." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Възникна грешка." });
      } else {
        setMsg({ type: "ok", text: "Паролата е сменена успешно." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMsg({ type: "err", text: "Възникна грешка при връзката със сървъра." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none focus:border-[#1DB954]/50";

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#151528] p-6 md:p-8">
      <h2 className="mb-4 text-xl font-semibold text-white">Смяна на парола</h2>

      <div className="space-y-3">
        <input
          type="password"
          className={inputClass}
          placeholder="Текуща парола"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
        <input
          type="password"
          className={inputClass}
          placeholder="Нова парола (мин. 6 символа)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          className={inputClass}
          placeholder="Потвърди новата парола"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {msg && (
          <div
            className={
              msg.type === "ok"
                ? "rounded-lg border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-3 text-sm text-[#1DB954]"
                : "rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            }
          >
            {msg.text}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-50"
        >
          {loading ? "Записване..." : "Смени паролата"}
        </button>
      </div>
    </div>
  );
}