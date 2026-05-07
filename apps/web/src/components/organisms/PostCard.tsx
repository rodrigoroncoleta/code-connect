import { Link } from 'react-router-dom'
import type { Post } from '../../services/posts.service'
import { Tag } from '../atoms/Tag'

interface PostCardProps {
  post: Post
  onLike?: (post: Post) => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const authorHandle = `@${post.author.name.split(' ')[0].toLowerCase()}`
  const initials = post.author.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <article className="flex flex-col bg-surface rounded-lg overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/posts/${post.id}`} className="block bg-muted/20 h-[200px] overflow-hidden">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-grafite">
            <span className="material-icons text-[64px] text-muted">code</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-2">
          <Link to={`/posts/${post.id}`}>
            <h2 className="text-offwhite text-lg font-semibold leading-snug hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted text-sm leading-relaxed line-clamp-3">{post.description}</p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-4 text-muted">
            <button
              type="button"
              onClick={() => onLike?.(post)}
              className={`flex flex-col items-center gap-0.5 text-xs cursor-pointer hover:text-accent transition-colors ${
                post.likedByMe ? 'text-accent' : ''
              }`}
              aria-label={post.likedByMe ? 'Descurtir' : 'Curtir'}
            >
              <span className="material-icons text-[22px]">favorite</span>
              <span>{post.likesCount}</span>
            </button>

            <div className="flex flex-col items-center gap-0.5 text-xs">
              <span className="material-icons text-[22px]">share</span>
              <span>0</span>
            </div>

            <Link
              to={`/posts/${post.id}#comments`}
              className="flex flex-col items-center gap-0.5 text-xs hover:text-accent transition-colors"
            >
              <span className="material-icons text-[22px]">chat</span>
              <span>{post.commentsCount}</span>
            </Link>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-surface">
              {initials}
            </div>
            <span className="text-muted text-xs">{authorHandle}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
