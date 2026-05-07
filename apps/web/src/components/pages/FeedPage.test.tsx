import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PostListResponse } from '../../services/posts.service'
import * as postsService from '../../services/posts.service'
import { FeedPage } from './FeedPage'

vi.mock('../../services/posts.service')
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })),
}))

const mockPosts: PostListResponse = {
  data: [
    {
      id: 1,
      title: 'Post de Teste',
      description: 'Descrição do post de teste.',
      content: null,
      thumbnail: null,
      tags: ['React'],
      createdAt: '2026-01-01T00:00:00.000Z',
      author: { id: 1, name: 'João Silva', email: 'joao@test.com' },
      likesCount: 2,
      commentsCount: 1,
      likedByMe: false,
    },
  ],
  total: 1,
  page: 1,
  limit: 12,
}

function renderFeedPage() {
  return render(
    <MemoryRouter>
      <FeedPage />
    </MemoryRouter>,
  )
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.mocked(postsService.fetchPosts).mockResolvedValue(mockPosts)
    vi.mocked(postsService.likePost).mockResolvedValue()
    vi.mocked(postsService.unlikePost).mockResolvedValue()
  })

  it('deve renderizar posts após carregamento', async () => {
    renderFeedPage()
    await waitFor(() => {
      expect(screen.getByText('Post de Teste')).toBeInTheDocument()
    })
  })

  it('deve exibir skeleton enquanto carrega', () => {
    renderFeedPage()
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('deve exibir mensagem quando nenhum post for encontrado', async () => {
    vi.mocked(postsService.fetchPosts).mockResolvedValue({
      ...mockPosts,
      data: [],
      total: 0,
    })
    renderFeedPage()
    await waitFor(() => {
      expect(screen.getByText('Nenhum post encontrado.')).toBeInTheDocument()
    })
  })

  it('deve buscar novamente ao trocar para aba Populares', async () => {
    renderFeedPage()
    await waitFor(() => screen.getByText('Post de Teste'))

    await userEvent.click(screen.getByRole('button', { name: 'Populares' }))

    await waitFor(() => {
      expect(postsService.fetchPosts).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'populares' }),
      )
    })
  })
})
