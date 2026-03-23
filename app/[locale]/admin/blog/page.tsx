'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  publishedAt: string | null
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
}

export default function AdminBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'bg'

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [published, setPublished] = useState(false)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push(`/${locale}/login`)
    } else {
      loadPosts()
    }
  }, [session, status])

  const loadPosts = async () => {
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  const resetForm = () => {
    setTitle(''); setExcerpt(''); setContent('')
    setCoverImage(''); setPublished(false)
    setMetaTitle(''); setMetaDescription('')
    setEditing(null)
  }

  const openCreate = () => { resetForm(); setView('create') }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setTitle(post.title)
    setExcerpt(post.excerpt || '')
    setContent(post.content)
    setCoverImage(post.coverImage || '')
    setPublished(post.published)
    setMetaTitle(post.metaTitle || '')
    setMetaDescription(post.metaDescription || '')
    setView('edit')
  }

  const handleSave = async () => {
    if (!title || !content) { setMessage('Заглавието и съдържанието са задължителни'); return }
    setSaving(true)
    setMessage('')

    const body = { title, excerpt, content, coverImage, published, metaTitle, metaDescription }
    const method = view === 'edit' ? 'PUT' : 'POST'
    const payload = view === 'edit' ? { ...body, id: editing!.id } : body

    const res = await fetch('/api/admin/blog', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setMessage('✅ Статията е запазена!')
      await loadPosts()
      setTimeout(() => { setMessage(''); setView('list'); resetForm() }, 1500)
    } else {
      const data = await res.json()
      setMessage(data.error || 'Грешка при запазване')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Изтрий "${title}"?`)) return
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
    await loadPosts()
  }

  const handleTogglePublish = async (post: BlogPost) => {
    await fetch('/api/admin/blog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, published: !post.published })
    })
    await loadPosts()
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center text-white">Зареждане...</div>
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/${locale}/admin`} className="text-[#1DB954] hover:underline text-sm mb-2 inline-block">← Назад към админ</Link>
            <h1 className="text-3xl font-bold text-white">📝 Управление на блога</h1>
          </div>
          {view === 'list' && (
            <button onClick={openCreate} className="rounded-xl bg-[#1DB954] px-5 py-2 font-semibold text-black hover:bg-[#1ed760]">
              + Нова статия
            </button>
          )}
          {view !== 'list' && (
            <button onClick={() => { setView('list'); resetForm() }} className="rounded-xl border border-gray-600 px-5 py-2 text-gray-300 hover:bg-gray-700">
              ← Назад
            </button>
          )}
        </div>

        {message && (
          <div className={`rounded-lg p-3 mb-6 ${message.startsWith('✅') ? 'bg-[#1DB954]/10 border border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="text-center py-16 text-gray-500 bg-[#151528] rounded-2xl border border-white/10">
                Няма статии. Създай първата!
              </div>
            )}
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#151528] px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-gray-700 text-gray-400'}`}>
                      {post.published ? '✅ Публикувана' : '⏳ Чернова'}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('bg-BG')}</span>
                  </div>
                  <h3 className="text-white font-semibold truncate">{post.title}</h3>
                  {post.excerpt && <p className="text-gray-400 text-sm truncate">{post.excerpt}</p>}
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-gray-700"
                  >
                    {post.published ? 'Скрий' : 'Публикувай'}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="px-3 py-1.5 rounded-lg bg-[#1A1A2E] border border-white/10 text-xs text-[#1DB954] hover:border-[#1DB954]/40"
                  >
                    ✏️ Редактирай
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT */}
        {(view === 'create' || view === 'edit') && (
          <div className="bg-[#151528] rounded-2xl border border-white/10 p-6 space-y-5">
            <h2 className="text-xl font-semibold text-white">
              {view === 'create' ? '✍️ Нова статия' : '✏️ Редактирай статия'}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">Заглавие *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
                  placeholder="Как да намериш добър специалист в Sofia" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">Кратко описание (excerpt)</label>
                <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
                  placeholder="Кратко описание което се вижда в списъка..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">URL на корична снимка</label>
                <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
                  placeholder="https://..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 text-sm">
                  Съдържание * 
                  <span className="text-xs text-gray-500 ml-2">HTML се поддържа (&lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;...)</span>
                </label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none font-mono text-sm"
                  placeholder="<h2>Въведение</h2><p>Текст на статията...</p>" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">SEO Заглавие</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
                  placeholder="По подразбиране — заглавието на статията" />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm">SEO Описание</label>
                <input type="text" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
                  placeholder="До 160 символа..." />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#1DB954]" />
                <span className="text-gray-300 text-sm">Публикувай веднага</span>
              </label>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 bg-[#1DB954] text-black font-semibold rounded-xl hover:bg-[#1ed760] disabled:opacity-50">
              {saving ? 'Запазване...' : view === 'create' ? '✅ Създай статия' : '✅ Запази промените'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}