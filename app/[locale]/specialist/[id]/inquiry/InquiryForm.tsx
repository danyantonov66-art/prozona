'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Props {
  specialistId: string
  specialistName: string
  specialistCity: string
  categoryId: number | null
  locale: string
}

export default function InquiryForm({
  specialistId,
  specialistName,
  specialistCity,
  categoryId,
  locale,
}: Props) {
  const router = useRouter()
  const { data: session } = useSession()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Здравейте,

Интересувам се от вашите услуги.

Име: ________
Телефон: ________
Град/адрес: ________
Кога ви е удобно: ________

Моля, свържете се с мен.

Поздрави,
________`,
    preferredDate: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: session?.user?.name || prev.name,
      email: session?.user?.email || prev.email,
    }))
  }, [session])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!session) {
      router.push(`/${locale}/login?callbackUrl=/${locale}/specialist/${specialistId}/inquiry`)
      return
    }

    if (!categoryId) {
      setError('Специалистът няма зададена категория.')
      setLoading(false)
      return
    }

    try {
      const finalMessage = formData.preferredDate
        ? `${formData.message}\n\nПредпочитана дата: ${formData.preferredDate}`
        : formData.message

      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialistId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: finalMessage,
          city: specialistCity,
          categoryId,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Грешка при изпращане')
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error(error)
      setError('Възникна грешка. Опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500 text-green-400 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h3 className="text-xl font-semibold mb-2">Запитването е изпратено</h3>
        <p className="mb-4">{specialistName} ще получи вашето съобщение.</p>

        <button
          onClick={() => router.push(`/${locale}/specialist/${specialistId}`)}
          className="text-green-400 hover:underline"
        >
          ← Назад към профила
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="bg-[#0D0D1A] rounded-lg p-4 mb-2">
        <p className="text-gray-400 text-sm">
          Попълнете местата с ________ в шаблона или го редактирайте свободно.
        </p>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Вашето име *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Телефон *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
          placeholder="0888 123 456"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Имейл *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Предпочитана дата</label>
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Съобщение *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
        />
        <p className="text-[#1DB954] text-sm mt-1">
          Може да оставите шаблона или да напишете собствено запитване.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50"
      >
        {loading ? 'Изпращане...' : 'Изпрати запитване'}
      </button>
    </form>
  )
}