import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Comment, Post } from '../../services/posts.service'
import * as postsService from '../../services/posts.service'
import { PostDetailPage } from './PostDetailPage'

vi.mock('../../services/posts.service')
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, name: 'João Silva', email: 'joao@test.com' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}))

const mockPost: Post = {
  id: 1,
  title: 'Post Detalhado',
  description: 'Descrição completa do post detalhado.',
  content: '# Código\n\n```tsx\nconst App = () => <div />\n```',
  thumbnail: null,
  tags: ['React', 'NestJS'],
  createdAt: '2026-01-15T10:00:00.000Z',
  author: { id: 2, name: 'Ana Beatriz', email: 'ana@test.com' },
  likesCount: 10,
  commentsCount: 2,
  likedByMe: false,
}

const mockComments: Comment[] = [
  {
    id: 1,
    content: 'Excelente post!',
    createdAt: '2026-01-16T08:00:00.000Z',
    author: { id: 1, name: 'João Silva', email: 'joao@test.com' },
  },
]

function renderPostDetailPage(postId = '1') {
  return render(
    <MemoryRouter initialEntries={[`/posts/${postId}`]}>
      <Routes>
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PostDetailPage', () => {
  beforeEach(() => {
    vi.mocked(postsService.fetchPost).mockResolvedValue(mockPost)
    vi.mocked(postsService.fetchComments).mockResolvedValue(mockComments)
    vi.mocked(postsService.addComment).mockResolvedValue({
      id: 2,
      content: 'Novo comentário!',
      createdAt: '2026-01-17T10:00:00.000Z',
      author: { id: 1, name: 'João Silva', email: 'joao@test.com' },
    })
    vi.mocked(postsService.likePost).mockResolvedValue()
    vi.mocked(postsService.unlikePost).mockResolvedValue()
  })

  it('deve renderizar título e descrição do post', async () => {
    renderPostDetailPage()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Post Detalhado' })).toBeInTheDocument()
    })
    expect(screen.getByText('Descrição completa do post detalhado.')).toBeInTheDocument()
  })

  it('deve renderizar tags do post', async () => {
    renderPostDetailPage()
    await waitFor(() => screen.getByText('React'))
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('NestJS')).toBeInTheDocument()
  })

  it('deve exibir comentários existentes', async () => {
    renderPostDetailPage()
    await waitFor(() => {
      expect(screen.getByText('Excelente post!')).toBeInTheDocument()
    })
  })

  it('deve exibir ícone "favorite" no botão de curtir', async () => {
    renderPostDetailPage()
    await waitFor(() => screen.getByText('Post Detalhado'))
    const likeBtn = screen.getByRole('button', { name: /curtir/i })
    expect(likeBtn.querySelector('.material-icons')?.textContent).toBe('favorite')
  })

  it('deve adicionar comentário e exibi-lo na lista', async () => {
    renderPostDetailPage()
    await waitFor(() => screen.getByText('Post Detalhado'))

    const textarea = screen.getByRole('textbox', { name: /comentário/i })
    await userEvent.type(textarea, 'Novo comentário!')
    await userEvent.click(screen.getByRole('button', { name: /comentar/i }))

    await waitFor(() => {
      expect(screen.getByText('Novo comentário!')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de erro ao falhar envio de comentário', async () => {
    vi.mocked(postsService.addComment).mockRejectedValue(new Error('Erro'))
    renderPostDetailPage()
    await waitFor(() => screen.getByText('Post Detalhado'))

    const textarea = screen.getByRole('textbox', { name: /comentário/i })
    await userEvent.type(textarea, 'Comentário com erro')
    await userEvent.click(screen.getByRole('button', { name: /comentar/i }))

    await waitFor(() => {
      expect(screen.getByText('Erro ao enviar comentário. Tente novamente.')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de post não encontrado em caso de erro', async () => {
    vi.mocked(postsService.fetchPost).mockRejectedValue(new Error('Not found'))
    renderPostDetailPage('999')

    await waitFor(() => {
      expect(screen.getByText('Post não encontrado.')).toBeInTheDocument()
    })
  })
})
