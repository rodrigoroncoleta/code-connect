import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Post } from '../../services/posts.service'
import { PostCard } from './PostCard'

const mockPost: Post = {
  id: 1,
  title: 'Como construir um Design System',
  description: 'Aprenda como criar um design system robusto.',
  content: null,
  thumbnail: null,
  tags: ['React', 'TypeScript'],
  createdAt: '2026-01-01T00:00:00.000Z',
  author: { id: 1, name: 'João Silva', email: 'joao@test.com' },
  likesCount: 5,
  commentsCount: 3,
  likedByMe: false,
}

function renderPostCard(post = mockPost, onLike?: (p: Post) => void) {
  return render(
    <MemoryRouter>
      <PostCard post={post} onLike={onLike} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('deve renderizar título e descrição', () => {
    renderPostCard()
    expect(screen.getByText('Como construir um Design System')).toBeInTheDocument()
    expect(screen.getByText('Aprenda como criar um design system robusto.')).toBeInTheDocument()
  })

  it('deve renderizar todas as tags', () => {
    renderPostCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('deve exibir contagem de likes e comentários', () => {
    renderPostCard()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('deve chamar onLike ao clicar no botão de curtir', async () => {
    const onLike = vi.fn()
    renderPostCard(mockPost, onLike)
    await userEvent.click(screen.getByRole('button', { name: /curtir/i }))
    expect(onLike).toHaveBeenCalledWith(mockPost)
  })

  it('deve usar ícone "favorite" no botão de curtir', () => {
    renderPostCard()
    const btn = screen.getByRole('button', { name: /curtir/i })
    expect(btn.querySelector('.material-icons')?.textContent).toBe('favorite')
  })

  it('deve exibir placeholder quando thumbnail é null', () => {
    renderPostCard()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('deve exibir imagem quando thumbnail está presente', () => {
    renderPostCard({ ...mockPost, thumbnail: 'https://example.com/img.jpg' })
    expect(screen.getByRole('img', { name: 'Como construir um Design System' })).toBeInTheDocument()
  })

  it('deve marcar botão de curtir com texto "Descurtir" quando likedByMe=true', () => {
    renderPostCard({ ...mockPost, likedByMe: true })
    expect(screen.getByRole('button', { name: /descurtir/i })).toBeInTheDocument()
  })
})
