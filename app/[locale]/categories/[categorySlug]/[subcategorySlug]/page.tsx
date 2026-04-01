'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'bg'

  const [step, setStep] = useState<'form' | 'role'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('role')
  }

  const handleRegister = async (role: 'CLIENT' | 'SPECIALIST') => {
    // Специалистите се регистрират през отделна форма с телефон и детайли
    if (role === 'SPECIALIST') {
      // Запази данните в sessionStorage и пренасочи към специалист формата
      sessionStorage.setItem('register_name', name)
      sessionStorage.setItem('register_email', email)
      sessionStorage.setItem('register_password', password)
      router.push(`/${locale}/register/specialist`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Грешка при регистрация')
      }

      await signIn('credentials', {
        email,
        password,
        callbackUrl: `/${locale}`
      })
    } catch (error: any) {
      setError(error.message)
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#1A1A2E] rounded-2xl p-8">

        {/* Лого */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PZ</span>
            </div>
            <span className="text-white font-semibold">ProZona</span>
          </Link>
          <h2 className="text-2xl font-bold text-white">
            {step === 'form' ? 'Създайте акаунт' : 'Как ще използвате ProZona?'}
          </h2>
          {step === 'role' && (
            <p className="text-gray-400 mt-2 text-sm">Изберете как искате да продължите</p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Стъпка 1 – Форма */}
        {step === 'form' && (
          <>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Име</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D1A] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Имейл</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D1A] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">Парола</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D1A] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 accent-[#1DB954]"
                />
                <label htmlFor="terms" className="text-gray-300 text-sm">
                  Съгласявам се с{' '}
                  <Link href="/terms" className="text-[#1DB954] hover:underline" target="_blank">
                    Общите условия
                  </Link>{' '}
                  и{' '}
                  <Link href="/privacy" className="text-[#1DB954] hover:underline" target="_blank">
                    Политиката за поверителност
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1DB954] text-white rounded-xl font-medium hover:bg-[#169b43] transition"
              >
                Продължи →
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1A2E] text-gray-400">или</span>
              </div>
            </div>

            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 flex items-center justify-center gap-2 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Регистрация с Google
            </button>

            <p className="text-center text-gray-400 mt-6 text-sm">
              Вече имате акаунт?{' '}
              <Link href={`/${locale}/login`} className="text-[#1DB954] hover:underline">
                Вход
              </Link>
            </p>
          </>
        )}

        {/* Стъпка 2 – Избор на роля */}
        {step === 'role' && (
          <div className="space-y-4">
            {/* Клиент */}
            <button
              onClick={() => handleRegister('CLIENT')}
              disabled={loading}
              className="w-full p-5 bg-[#0D0D1A] border-2 border-gray-700 hover:border-[#1DB954] rounded-2xl text-left transition group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔍</div>
                <div>
                  <p className="text-white font-semibold text-lg group-hover:text-[#1DB954] transition">
                    Търся специалист
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Искам да намеря майстор, почистване или друга услуга
                  </p>
                </div>
              </div>
            </button>

            {/* Специалист */}
            <button
              onClick={() => handleRegister('SPECIALIST')}
              disabled={loading}
              className="w-full p-5 bg-[#0D0D1A] border-2 border-gray-700 hover:border-[#1DB954] rounded-2xl text-left transition group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔧</div>
                <div>
                  <p className="text-white font-semibold text-lg group-hover:text-[#1DB954] transition">
                    Аз съм специалист
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Искам да получавам запитвания и да намирам нови клиенти
                  </p>
                </div>
              </div>
            </button>

            {loading && (
              <p className="text-center text-gray-400 text-sm">Регистрация...</p>
            )}

            <button
              onClick={() => setStep('form')}
              className="w-full text-gray-500 hover:text-gray-300 text-sm mt-2 transition"
            >
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  )
}