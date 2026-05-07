import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { Post } from '../../services/posts.service'
import * as postsService from '../../services/posts.service'
import { Tag } from '../atoms/Tag'
import { PostCard } from '../organisms/PostCard'
import { FeedLayout } from '../templates/FeedLayout'

export function FeedPage() {
  const { isAuthenticated } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [tab, setTab] = useState<'recentes' | 'populares'>('recentes')

  const LIMIT = 12
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(
    async (q: string, p: number) => {
      setIsLoading(true)
      try {
        const res = await postsService.fetchPosts({ q: q || undefined, page: p, limit: LIMIT, sort: tab })
        setPosts(res.data)
        setTotal(res.total)
        setPage(p)
      } finally {
        setIsLoading(false)
      }
    },
    [tab],
  )

  useEffect(() => {
    load(appliedQuery, 1)
  }, [appliedQuery, tab, load])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchInput.trim()
    if (q && !activeFilters.includes(q)) {
      setActiveFilters((prev) => [...prev, q])
    }
    setAppliedQuery(searchInput.trim())
    setPage(1)
  }

  function handleClearAll() {
    setSearchInput('')
    setAppliedQuery('')
    setActiveFilters([])
    setPage(1)
    inputRef.current?.focus()
  }

  function handleRemoveFilter(filter: string) {
    const updated = activeFilters.filter((f) => f !== filter)
    setActiveFilters(updated)
    const newQ = updated.join(' ')
    setAppliedQuery(newQ)
    if (updated.length === 0) setSearchInput('')
    setPage(1)
  }

  async function handleLike(post: Post) {
    if (!isAuthenticated) return
    try {
      if (post.likedByMe) {
        await postsService.unlikePost(post.id)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, likedByMe: false, likesCount: p.likesCount - 1 }
              : p,
          ),
        )
      } else {
        await postsService.likePost(post.id)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, likedByMe: true, likesCount: p.likesCount + 1 }
              : p,
          ),
        )
      }
    } catch {
      // silently ignore conflict errors
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <FeedLayout>
      <div className="flex flex-col gap-14">
        {/* Search */}
        <section className="flex flex-col gap-4">
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3 bg-surface rounded px-4 py-2">
              <span className="material-icons text-muted text-3xl">search</span>
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Digite o que você procura"
                className="flex-1 bg-transparent text-offwhite text-xl placeholder:text-muted outline-none"
                aria-label="Buscar posts"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setAppliedQuery(''); setActiveFilters([]); }}
                  className="material-icons text-muted text-xl hover:text-offwhite cursor-pointer"
                  aria-label="Limpar busca"
                >
                  close
                </button>
              )}
            </div>
          </form>

          {activeFilters.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {activeFilters.map((f) => (
                  <Tag key={f} label={f} onRemove={() => handleRemoveFilter(f)} />
                ))}
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-muted text-sm hover:text-offwhite transition-colors whitespace-nowrap cursor-pointer"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </section>

        {/* Tabs + Grid */}
        <section className="flex flex-col gap-8">
          <div className="flex gap-6 justify-center">
            <TabButton active={tab === 'recentes'} onClick={() => setTab('recentes')}>
              Recentes
            </TabButton>
            <TabButton active={tab === 'populares'} onClick={() => setTab('populares')}>
              Populares
            </TabButton>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-lg h-[360px] animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-muted">
              <span className="material-icons text-[64px]">search_off</span>
              <p className="text-xl">Nenhum post encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={isAuthenticated ? handleLike : undefined}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => load(appliedQuery, page - 1)}
                className="material-icons text-muted hover:text-offwhite disabled:opacity-30 cursor-pointer"
                aria-label="Página anterior"
              >
                chevron_left
              </button>
              <span className="text-muted text-sm self-center">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => load(appliedQuery, page + 1)}
                className="material-icons text-muted hover:text-offwhite disabled:opacity-30 cursor-pointer"
                aria-label="Próxima página"
              >
                chevron_right
              </button>
            </div>
          )}
        </section>
      </div>
    </FeedLayout>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xl px-1 transition-colors cursor-pointer ${
        active
          ? 'text-accent font-semibold underline underline-offset-4 decoration-accent'
          : 'text-muted hover:text-offwhite'
      }`}
    >
      {children}
    </button>
  )
}
