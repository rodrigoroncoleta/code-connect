import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { Comment, Post } from '../../services/posts.service'
import * as postsService from '../../services/posts.service'
import { Tag } from '../atoms/Tag'
import { FeedLayout } from '../templates/FeedLayout'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const postId = Number(id)
    setIsLoading(true)
    setError(null)
    Promise.all([
      postsService.fetchPost(postId),
      postsService.fetchComments(postId),
    ])
      .then(([p, c]) => {
        setPost(p)
        setComments(c)
      })
      .catch(() => setError('Post não encontrado.'))
      .finally(() => setIsLoading(false))
  }, [id])

  async function handleLike() {
    if (!post || !isAuthenticated) return
    try {
      if (post.likedByMe) {
        await postsService.unlikePost(post.id)
        setPost({ ...post, likedByMe: false, likesCount: post.likesCount - 1 })
      } else {
        await postsService.likePost(post.id)
        setPost({ ...post, likedByMe: true, likesCount: post.likesCount + 1 })
      }
    } catch {
      // silently ignore
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!post || !commentText.trim() || !isAuthenticated) return
    setIsSubmitting(true)
    try {
      const comment = await postsService.addComment(post.id, commentText.trim())
      setComments((prev) => [...prev, comment])
      setCommentText('')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <FeedLayout>
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="bg-surface rounded-lg h-[360px]" />
          <div className="bg-surface rounded h-8 w-2/3" />
          <div className="bg-surface rounded h-4 w-full" />
        </div>
      </FeedLayout>
    )
  }

  if (error || !post) {
    return (
      <FeedLayout>
        <div className="flex flex-col items-center gap-4 py-20 text-muted">
          <span className="material-icons text-[64px]">error_outline</span>
          <p className="text-xl">{error ?? 'Post não encontrado.'}</p>
          <Link to="/feed" className="text-accent hover:underline">
            Voltar ao Feed
          </Link>
        </div>
      </FeedLayout>
    )
  }

  const authorHandle = `@${post.author.name.split(' ')[0].toLowerCase()}`
  const initials = post.author.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <FeedLayout>
      <article className="flex flex-col gap-8">
        {/* Back */}
        <Link to="/feed" className="flex items-center gap-1 text-muted text-sm hover:text-accent transition-colors w-fit">
          <span className="material-icons text-base">arrow_back</span>
          Voltar ao feed
        </Link>

        {/* Thumbnail */}
        <div className="rounded-lg overflow-hidden bg-grafite h-[360px]">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-icons text-[96px] text-muted">code</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-4">
          <h1 className="text-offwhite text-3xl font-semibold leading-snug">{post.title}</h1>

          {/* Author + date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-surface">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-offwhite text-sm">{post.author.name}</span>
              <span className="text-muted text-xs">{authorHandle}</span>
            </div>
            <span className="text-muted text-xs ml-auto">
              {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-muted text-lg leading-relaxed">{post.description}</p>

        {/* Content */}
        {post.content && (
          <pre className="bg-grafite rounded-lg p-6 overflow-x-auto text-offwhite text-sm leading-relaxed whitespace-pre-wrap">
            <code>{post.content}</code>
          </pre>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-6 py-4 border-t border-surface">
          <button
            type="button"
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isAuthenticated ? 'cursor-pointer' : 'cursor-default'
            } ${post.likedByMe ? 'text-accent' : 'text-muted hover:text-accent'}`}
            title={isAuthenticated ? undefined : 'Faça login para curtir'}
          >
            <span className="material-icons text-xl">code</span>
            {post.likesCount} curtidas
          </button>

          <a
            href="#comments"
            className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <span className="material-icons text-xl">chat</span>
            {post.commentsCount} comentários
          </a>
        </div>

        {/* Comments */}
        <section id="comments" className="flex flex-col gap-6">
          <h2 className="text-offwhite text-xl font-semibold">
            Comentários ({comments.length})
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleComment} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted text-sm mb-1">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-surface">
                  {user?.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <span>{user?.name}</span>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                rows={3}
                className="w-full bg-surface text-offwhite text-sm rounded-lg p-3 placeholder:text-muted outline-none resize-none focus:ring-1 focus:ring-accent"
                aria-label="Comentário"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="bg-accent text-accent-text text-sm font-semibold px-5 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-muted text-sm">
              <Link to="/" className="text-accent hover:underline">
                Faça login
              </Link>{' '}
              para comentar.
            </p>
          )}

          {/* Comment list */}
          <div className="flex flex-col gap-6">
            {comments.map((c) => {
              const cInitials = c.author.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase()
              return (
                <div key={c.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-surface">
                      {cInitials}
                    </div>
                    <span className="text-offwhite text-sm font-medium">{c.author.name}</span>
                    <span className="text-muted text-xs ml-auto">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed pl-9">{c.content}</p>
                </div>
              )
            })}
          </div>
        </section>
      </article>
    </FeedLayout>
  )
}
