import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { LoginForm } from './LoginForm'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <main>
        <LoginForm />
      </main>
    </MemoryRouter>,
  )
}

describe('LoginForm — acessibilidade WCAG 2 AA', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
