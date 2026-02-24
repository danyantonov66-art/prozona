// app/contact/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Тук ще добавим изпращане до имейл
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Контакти
        </h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Свържете се с нас за въпроси и предложения
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Форма за контакт */}
          <div className="bg-[#1A1A2E] rounded-lg p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Благодарим ви!</h3>
                <p className="text-gray-400">
                  Ще се свържем с вас възможно най-скоро.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Име *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Имейл *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Относно *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Съобщение *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
                >
                  Изпрати съобщение
                </button>
              </form>
            )}
          </div>

          {/* Информация за контакт */}
          <div className="space-y-6">
            <div className="bg-[#1A1A2E] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Свържете се с нас</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1DB954]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Имейл</p>
                    <p className="text-white">office@prozona.bg</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1DB954]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Телефон</p>
                    <p className="text-white">+359 888 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1DB954]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Адрес</p>
                    <p className="text-white">София, България</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Работно време</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Понеделник - Петък</span>
                  <span className="text-white">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Събота</span>
                  <span className="text-white">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Неделя</span>
                  <span className="text-white">Почивен ден</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}