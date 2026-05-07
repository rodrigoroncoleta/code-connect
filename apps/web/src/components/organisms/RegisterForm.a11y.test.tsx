import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { vi } from 'vitest'
import { RegisterForm } from './RegisterForm'

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

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <main>
        <RegisterForm />
      </main>
    </MemoryRouter>,
  )
}

describe('RegisterForm — acessibilidade WCAG 2 AA', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
